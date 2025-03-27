<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost';
$db = 'ufd'; 
$user = 'root'; 
$pass = ''; 

// Crear conexión
$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión: ' . $conn->connect_error]));
}

// Consulta para obtener todas las publicaciones
$sql = "SELECT 
            ap.id AS id_publico, 
            ap.fecha_publicacion AS fecha_publico, 
            ap.tema AS tema_publico, 
            ap.categoria AS categoria_publica,
            apr.id AS id_privado, 
            apr.fecha_publicacion AS fecha_privado, 
            apr.tema AS tema_privado, 
            apr.categoria AS categoria_privada
        FROM articulos_publicos ap
        LEFT JOIN articulos_privados apr ON ap.categoria = apr.categoria";

// Ejecutar la consulta
$result = $conn->query($sql);

// Inicializar un array para almacenar las publicaciones
$publicaciones = [];

if ($result) {
    if ($result->num_rows > 0) {
        // Recorrer los resultados y agregarlos al array
        while ($row = $result->fetch_assoc()) {
            $publicaciones[] = $row; // Cada fila se agrega al array
        }
    }
    // Devolver el resultado en formato JSON
    echo json_encode(['success' => true, 'publicaciones' => $publicaciones]);
} else {
    // Si hay un error en la consulta, devolver un mensaje
    echo json_encode(['success' => false, 'message' => 'Error en la consulta: ' . $conn->error]);
}

// Cerrar la conexión
$conn->close();
?>