<?php
// Archivo: api/usuarios.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Parámetros de conexión directos
$host = "localhost";
$db_name = "ufd";
$username = "root";
$password = ""; 

try {
    // Crear conexión PDO
    $db = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, value: PDO::ERRMODE_EXCEPTION);
    
    // Consulta SQL para obtener los usuarios
    $query = "SELECT id, nombre_usuario, contrasena, fecha_creacion, estado, id_area, rol FROM usuarios";
    $stmt = $db->prepare($query);
    $stmt->execute();

    // Verificar si hay resultados
    if($stmt->rowCount() > 0) {
        // Array de usuarios
        $usuarios = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // No incluimos la contraseña por seguridad
            $usuarios[] = array(
                "id" => $row['id'],
                "nombre_usuario" => $row['nombre_usuario'],
                "contrasena" => $row['contrasena'],
                "fecha_creacion" => $row['fecha_creacion'],
                "estado" => $row['estado'],
                "id_area" => $row['id_area'],
                "rol" => $row['rol']
            );
        }
        
        // Código de respuesta - 200 OK
        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "data" => $usuarios
        ));
    } else {
        // Código de respuesta - 404 No encontrado
        http_response_code(404);
        echo json_encode(array(
            "success" => false,
            "message" => "No se encontraron usuarios."
        ));
    }
    
} catch(PDOException $exception) {
    // Código de respuesta - 500 Error del servidor
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error de conexión: " . $exception->getMessage()
    ));
}
?>