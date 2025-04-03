<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Añade OPTIONS
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejar preflight request para CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de la base de datos
$host = "localhost";
$db_name = "ufd";
$username = "root";
$password = "";

try {
    // Obtener datos del cuerpo de la solicitud
    $json = file_get_contents('php://input');
    $data = json_decode($json);
    
    // Validar datos recibidos
    if(!$data || !isset($data->id)) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "message" => "Datos incompletos o incorrectos.",
            "received_data" => $json // Para debugging
        ));
        exit();
    }

    // Conectar a la base de datos
    $db = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Preparar consulta SQL
    $query = "UPDATE usuarios SET 
              nombre_usuario = :nombre_usuario,
              contrasena = :contrasena,
              rol = :rol
              WHERE id = :id";
    
    $stmt = $db->prepare($query);
    
    // Limpiar y vincular parámetros
    $nombre_usuario = isset($data->nombre_usuario) ? htmlspecialchars(strip_tags($data->nombre_usuario)) : '';
    $contrasena = isset($data->contrasena) ? htmlspecialchars(strip_tags($data->contrasena)) : '';
    $rol = isset($data->rol) ? htmlspecialchars(strip_tags($data->rol)) : '';
    $id = htmlspecialchars(strip_tags($data->id));
    
    $stmt->bindParam(":nombre_usuario", $nombre_usuario);
    $stmt->bindParam(":contrasena", $contrasena);
    $stmt->bindParam(":rol", $rol);
    $stmt->bindParam(":id", $id);
    
    // Ejecutar consulta
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "message" => "Área actualizada correctamente.",
            "affected_rows" => $stmt->rowCount()
        ));
    } else {
        http_response_code(500);
        echo json_encode(array(
            "success" => false,
            "message" => "Error al ejecutar la consulta.",
            "error_info" => $stmt->errorInfo()
        ));
    }
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error de conexión: " . $exception->getMessage(),
        "trace" => $exception->getTraceAsString()
    ));
}
?>