<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

$sql = "SELECT * FROM categorias_alimentador ORDER BY nombre ASC";
$result = $conn->query($sql);

$categorias = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $categorias[] = [
            "id" => $row["id_categoria"],
            "categoria" => $row["nombre"],
            "descripcion" => $row["descripcion"],
            "publicaciones" => $row["num_publicaciones"]
        ];
    }
}

echo json_encode(["success" => true, "categorias" => $categorias]);

$conn->close();
?>