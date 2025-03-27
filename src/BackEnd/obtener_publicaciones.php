<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost';
$db = 'ufd'; 
$user = 'root'; 
$pass = ''; 

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión: ' . $conn->connect_error]));
}

$sql = "SELECT 
            id AS id_publico, 
            fecha_publicacion AS fecha_publico, 
            tema AS tema_publico, 
            categoria AS categoria_publica,
            palabras_clave
        FROM articulos_publicos";

$result = $conn->query($sql);
$publicaciones = [];

if ($result) {
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $publicaciones[] = $row;
        }
    }
    echo json_encode(['success' => true, 'publicaciones' => $publicaciones]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error en la consulta: ' . $conn->error]);
}

$conn->close();
?>