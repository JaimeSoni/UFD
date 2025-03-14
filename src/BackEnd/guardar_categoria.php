<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejo de la solicitud OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ufd";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data["nombre"]) && !empty($data["nombre"])) {
    $nombre = $data["nombre"];
    $descripcion = isset($data["descripcion"]) ? $data["descripcion"] : "";
    
    $sql = "INSERT INTO categorias_alimentador (nombre, descripcion) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $nombre, $descripcion);
    
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true, 
            "message" => "Categoría creada exitosamente",
            "id" => $conn->insert_id
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "Error al crear la categoría: " . $stmt->error
        ]);
    }
    
    $stmt->close();
} else {
    echo json_encode([
        "success" => false, 
        "message" => "Falta el nombre de la categoría"
    ]);
}

$conn->close();
?>