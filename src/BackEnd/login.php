<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejo de la solicitud OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // Respuesta vacía para las solicitudes OPTIONS
    exit; // Termina el script aquí
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ufd";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión"]));
}

$data = json_decode(file_get_contents("php://input"), true);
$usuario = $data["usuario"];
$contrasena = $data["contrasena"];

$sql = "SELECT * FROM login_alimentador WHERE usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // Comparación directa de contraseñas (para contraseñas en texto plano)
    if ($contrasena === $row["contrasena"]) {
        echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso", "area" => $row["area"]]);
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
}

$conn->close();
?>