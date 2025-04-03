<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$db_name = "ufd";
$username = "root";
$password = "";

try {
    $data = json_decode(file_get_contents("php://input"));
    
    if(!$data || !isset($data->id) || !isset($data->estado)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Datos incompletos"]);
        exit();
    }

    $db = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $query = "UPDATE usuarios SET estado = :estado WHERE id = :id";
    $stmt = $db->prepare($query);
    
    $estado = htmlspecialchars(strip_tags($data->estado));
    $id = htmlspecialchars(strip_tags($data->id));
    
    $stmt->bindParam(":estado", $estado);
    $stmt->bindParam(":id", $id);
    
    if($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Estado actualizado",
            "affected_rows" => $stmt->rowCount()
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al ejecutar la consulta"
        ]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error de base de datos: " . $e->getMessage()
    ]);
}
?>