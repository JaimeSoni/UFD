<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ufd";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8");

if ($conn->connect_error) {
    die(json_encode([
        "status" => "error",
        "message" => "Connection failed: " . $conn->connect_error
    ]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos del formulario
    $postId = $_POST['id'] ?? null;
    $tema = $_POST['topic'] ?? null;
    $categoria = $_POST['category'] ?? null;
    $descripcion = $_POST['description'] ?? null;
    
    // Procesar palabras clave y URLs
    $palabras_clave = isset($_POST['keywords']) ? 
        (is_string($_POST['keywords']) ? json_decode($_POST['keywords'], true) : $_POST['keywords']) : [];
    $urls = isset($_POST['urls']) ? 
        (is_string($_POST['urls']) ? json_decode($_POST['urls'], true) : $_POST['urls']) : [];
    
    // Procesar archivos existentes
    $existingFiles = isset($_POST['existing_files']) ? 
        (is_string($_POST['existing_files']) ? json_decode($_POST['existing_files'], true) : $_POST['existing_files']) : [];
    
    // Directorio para subir archivos
    $uploadDir = 'uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    // Procesar nuevos archivos
    $newFiles = [];
    if (!empty($_FILES['files']['name'][0])) {
        foreach ($_FILES['files']['tmp_name'] as $key => $tmpName) {
            $fileName = $_FILES['files']['name'][$key];
            $fileType = $_FILES['files']['type'][$key];
            $fileSize = $_FILES['files']['size'][$key];
            
            // Validar tipo y tamaño
            $allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'application/vnd.ms-excel', 
                           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            
            if (in_array($fileType, $allowedTypes) && $fileSize <= 5 * 1024 * 1024) {
                $newFileName = uniqid() . '_' . $fileName;
                if (move_uploaded_file($tmpName, $uploadDir . $newFileName)) {
                    $newFiles[] = $newFileName;
                }
            }
        }
    }
    
    // Combinar archivos existentes y nuevos (máximo 2)
    $allFiles = array_merge($existingFiles, $newFiles);
    if (count($allFiles) > 2) {
        $allFiles = array_slice($allFiles, 0, 2);
    }
    
    // Convertir a JSON para almacenar
    $palabras_clave_json = json_encode($palabras_clave);
    $urls_json = json_encode($urls);
    $archivos_json = json_encode($allFiles);
    
    // Actualizar en la base de datos
    $stmt = $conn->prepare("UPDATE articulos_privados SET 
        tema = ?, 
        categoria = ?, 
        descripcion = ?, 
        palabras_clave = ?, 
        urls = ?, 
        archivos = ?,
        fecha_actualizacion = NOW()
        WHERE id = ?");
    
    $stmt->bind_param("ssssssi", 
        $tema, $categoria, $descripcion, 
        $palabras_clave_json, $urls_json, $archivos_json, 
        $postId);
    
    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Artículo actualizado correctamente",
            "archivos" => $allFiles // Devolver la lista actualizada de archivos
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Error al actualizar: " . $stmt->error
        ]);
    }
    
    $stmt->close();
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Método no permitido"
    ]);
}

$conn->close();
?>