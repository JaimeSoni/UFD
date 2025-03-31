<?php

ob_clean(); // Limpia cualquier salida previa
header('Content-Type: application/json');

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database connection
$servername = "localhost";
$username = "root"; // Replace with your DB username
$password = ""; // Replace with your DB password
$dbname = "ufd"; // Replace with your DB name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8");

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error",
        "message" => "Connection failed: " . $conn->connect_error
    ]));
}

// Process the request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Debug: Log POST data
    error_log("POST Data received: " . print_r($_POST, true));
    
    // Retrieve data with the correct field names
    $postId = isset($_POST['id']) ? $_POST['id'] : null;
    $tema = isset($_POST['topic']) ? $_POST['topic'] : null;
    $categoria = isset($_POST['category']) ? $_POST['category'] : null;
    $descripcion = isset($_POST['description']) ? $_POST['description'] : null;
    
    // Handle arrays (standard format and array format)
    $palabras_clave = [];
    if (isset($_POST['keywords']) && !is_array($_POST['keywords'])) {
        $palabras_clave = [$_POST['keywords']];
    } elseif (isset($_POST['keywords']) && is_array($_POST['keywords'])) {
        $palabras_clave = $_POST['keywords'];
    } elseif (isset($_POST['keywords[]'])) {
        $palabras_clave = $_POST['keywords[]'];
    }
    
    $urls = [];
    if (isset($_POST['urls']) && !is_array($_POST['urls'])) {
        $urls = [$_POST['urls']];
    } elseif (isset($_POST['urls']) && is_array($_POST['urls'])) {
        $urls = $_POST['urls'];
    } elseif (isset($_POST['urls[]'])) {
        $urls = $_POST['urls[]'];
    }
    
    // Set date to current if not provided
    $date = isset($_POST['fecha_publicacion']) ? $_POST['fecha_publicacion'] : date('Y-m-d');

    // Debug: Log important values
    error_log("ID: $postId, Tema: $tema, Categoria: $categoria");
    error_log("Palabras clave: " . print_r($palabras_clave, true));
    error_log("URLs: " . print_r($urls, true));

    // Check required fields
    if (!$postId || !$tema || !$categoria) {
        echo json_encode([
            "status" => "error",
            "message" => "Missing required fields",
            "debug" => [
                "id" => $postId ? "presente" : "faltante",
                "topic" => $tema ? "presente" : "faltante",
                "category" => $categoria ? "presente" : "faltante",
                "POST_DATA" => $_POST
            ]
        ]);
        exit;
    }

    // Convert arrays to strings for storage
    $palabras_clave_str = is_array($palabras_clave) ? implode(',', $palabras_clave) : (string)$palabras_clave;
    $urls_str = is_array($urls) ? implode(',', $urls) : (string)$urls;

    // Start transaction
    $conn->begin_transaction();

    try {
        // Update the article
        $stmt = $conn->prepare("UPDATE articulos_privados SET 
            fecha_publicacion = ?, 
            tema = ?, 
            categoria = ?, 
            descripcion = ?, 
            palabras_clave = ?, 
            urls = ?,
            fecha_actualizacion = CURRENT_TIMESTAMP 
            WHERE id = ?");

        $stmt->bind_param(
            "ssssssi",
            $date,
            $tema,
            $categoria,
            $descripcion,
            $palabras_clave_str,
            $urls_str,
            $postId
        );

        if (!$stmt->execute()) {
            throw new Exception("Error updating article: " . $stmt->error);
        }

        // Process files if there are new ones
        if (!empty($_FILES['files']['name'][0])) {
            $uploadDir = '../uploads/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            // Get existing files
            $stmtFiles = $conn->prepare("SELECT archivos FROM articulos_privados WHERE id = ?");
            $stmtFiles->bind_param("i", $postId);
            $stmtFiles->execute();
            $result = $stmtFiles->get_result();
            $row = $result->fetch_assoc();

            $existingFiles = !empty($row['archivos']) ? explode(',', $row['archivos']) : [];
            $newFiles = [];

            // Upload new files
            $fileCount = count($_FILES['files']['name']);
            for ($i = 0; $i < $fileCount; $i++) {
                $fileName = $_FILES['files']['name'][$i];
                $tmpName = $_FILES['files']['tmp_name'][$i];
                $fileType = $_FILES['files']['type'][$i];
                $fileSize = $_FILES['files']['size'][$i];

                // Check file type and size
                $allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
                $maxSize = 5 * 1024 * 1024; // 5MB

                if (!in_array($fileType, $allowedTypes) || $fileSize > $maxSize) {
                    continue;
                }

                $newFileName = uniqid() . '_' . $fileName;
                if (move_uploaded_file($tmpName, $uploadDir . $newFileName)) {
                    $newFiles[] = $newFileName;
                }
            }

            // Combine existing and new files, with a maximum of 2 files total
            $allFiles = array_merge($existingFiles, $newFiles);
            if (count($allFiles) > 2) {
                $allFiles = array_slice($allFiles, -2); // Keep the two most recent files
            }

            $filesStr = implode(',', $allFiles);

            // Update files in database
            $stmtUpdateFiles = $conn->prepare("UPDATE articulos_privados SET archivos = ? WHERE id = ?");
            $stmtUpdateFiles->bind_param("si", $filesStr, $postId);

            if (!$stmtUpdateFiles->execute()) {
                throw new Exception("Error updating files: " . $stmtUpdateFiles->error);
            }
        }

        // Commit transaction
        $conn->commit();

        echo json_encode([
            "status" => "success",
            "message" => "Article updated successfully",
            "id" => $postId
        ]);

    } catch (Exception $e) {
        // Rollback on error
        $conn->rollback();
        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    }

    // Close the connection
    $stmt->close();
    $conn->close();

} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method"
    ]);
}

exit;
?>