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
    // Retrieve data with the correct field names
    $postId = isset($_POST['id']) ? $_POST['id'] : null;
    $tema = isset($_POST['topic']) ? $_POST['topic'] : null;
    $categoria = isset($_POST['category']) ? $_POST['category'] : null;
    $descripcion = isset($_POST['description']) ? $_POST['description'] : null;

    // Handle arrays 
    $palabras_clave = isset($_POST['keywords']) ? json_decode($_POST['keywords'], true) : [];
    $urls = isset($_POST['urls']) ? json_decode($_POST['urls'], true) : [];

    // Set date to current if not provided
    $date = isset($_POST['fecha_publicacion']) ? $_POST['fecha_publicacion'] : date('Y-m-d');

    // Check required fields
    if (!$postId || !$tema || !$categoria) {
        echo json_encode([
            "status" => "error",
            "message" => "Missing required fields"
        ]);
        exit;
    }

    // Convert arrays to strings for storage
    $palabras_clave_str = implode(',', $palabras_clave);
    $urls_str = implode(',', $urls);

    // Start transaction
    $conn->begin_transaction();

    try {
        // Get existing files from database first
        $stmtGetFiles = $conn->prepare("SELECT archivos FROM articulos_publicos WHERE id = ?");
        $stmtGetFiles->bind_param("i", $postId);
        $stmtGetFiles->execute();
        $result = $stmtGetFiles->get_result();
        $row = $result->fetch_assoc();
        $existingFilesStr = $row['archivos'] ?? '';
        
        // Parse existing files
        $existingFiles = [];
        if (!empty($existingFilesStr)) {
            // Try to parse as JSON first
            $jsonDecoded = json_decode($existingFilesStr, true);
            if (is_array($jsonDecoded)) {
                $existingFiles = $jsonDecoded;
            } else {
                // If not JSON, treat as comma-separated list
                $existingFiles = array_filter(array_map('trim', explode(',', $existingFilesStr)));
            }
        }
        
        // Get existing files from frontend (these are the ones the user wants to keep)
        $keptFiles = [];
        if (isset($_POST['existing_files'])) {
            $keptFilesData = $_POST['existing_files'];
            if (is_string($keptFilesData)) {
                // Try to parse as JSON
                $jsonDecoded = json_decode($keptFilesData, true);
                if (is_array($jsonDecoded)) {
                    $keptFiles = $jsonDecoded;
                } else {
                    // If not JSON, treat as comma-separated list
                    $keptFiles = array_filter(array_map('trim', explode(',', $keptFilesData)));
                }
            } else if (is_array($keptFilesData)) {
                $keptFiles = $keptFilesData;
            }
        }

        // Process new uploaded files
        $newFiles = [];
        if (!empty($_FILES['files']['name'][0])) {
            $uploadDir = '../uploads/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

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
        }
        
        // Combine kept files and new files
        $allFiles = array_merge($keptFiles, $newFiles);
        
        // Limit to 2 files if needed
        if (count($allFiles) > 2) {
            $allFiles = array_slice($allFiles, -2); // Keep only the 2 most recent
        }
        
        // Convert to string for storage
        $archivos_str = implode(',', $allFiles);

        // Update the article
        $stmt = $conn->prepare("UPDATE articulos_publicos SET 
            fecha_publicacion = ?, 
            tema = ?, 
            categoria = ?, 
            descripcion = ?, 
            palabras_clave = ?, 
            urls = ?, 
            archivos = ?, 
            fecha_actualizacion = CURRENT_TIMESTAMP 
            WHERE id = ?");

        $stmt->bind_param(
            "sssssssi",
            $date,
            $tema,
            $categoria,
            $descripcion,
            $palabras_clave_str,
            $urls_str,
            $archivos_str,
            $postId
        );

        if (!$stmt->execute()) {
            throw new Exception("Error updating article: " . $stmt->error);
        }

        // Commit transaction
        $conn->commit();

        echo json_encode([
            "status" => "success",
            "message" => "Article updated successfully",
            "id" => $postId,
            "files" => $allFiles // Return the files for debugging
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
    $conn->close();

} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method"
    ]);
}

exit;
?>