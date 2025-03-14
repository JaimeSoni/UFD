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

if (isset($data["id"])) {
    $id = $data["id"];
    
    // Verificar si la categoría tiene publicaciones asociadas
    $sql_check = "SELECT num_publicaciones FROM categorias_alimentador WHERE id_categoria = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("i", $id);
    $stmt_check->execute();
    $result = $stmt_check->get_result();
    $row = $result->fetch_assoc();
    
    if ($row && $row["num_publicaciones"] > 0) {
        echo json_encode([
            "success" => false, 
            "message" => "No se puede eliminar una categoría con publicaciones asociadas"
        ]);
    } else {
        $sql = "DELETE FROM categorias_alimentador WHERE id_categoria = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true, 
                "message" => "Categoría eliminada exitosamente"
            ]);
        } else {
            echo json_encode([
                "success" => false, 
                "message" => "Error al eliminar la categoría: " . $stmt->error
            ]);
        }
        $stmt->close();
    }
    $stmt_check->close();
} else {
    echo json_encode([
        "success" => false, 
        "message" => "ID de categoría no proporcionado"
    ]);
}

$conn->close();
?>