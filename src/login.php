<?php
// login.php - Place this file in an 'api' folder on your server

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Manejar solicitudes preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar si es una solicitud POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

// Obtener datos enviados
$data = json_decode(file_get_contents("php://input"), true);

// Validar campos requeridos
if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Usuario y contraseña son requeridos']);
    exit();
}

// Conexión a la base de datos
$servername = "localhost";
$username = "root";  // Reemplazar con tu usuario de BD
$password = "";      // Reemplazar con tu contraseña de BD
$dbname = "ufd";     // Tu nombre de base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit();
}

// Obtener usuario y contraseña de la solicitud
$username = $data['username'];
$password = $data['password'];

// Preparar la consulta SQL para prevenir inyección SQL
$stmt = $conn->prepare("SELECT id, nombre_usuario, contrasena, rol, id_area, estado FROM usuarios WHERE nombre_usuario = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // Verificar si la cuenta está activa
    if ($user['estado'] === 'Inactivo') {
        echo json_encode(['success' => false, 'message' => 'Esta cuenta está desactivada']);
        exit();
    }
    
    // Verificar la contraseña
    if ($password === $user['contrasena']) {
        // Contraseña correcta, usuario autenticado
        // Eliminar la contraseña de la respuesta por seguridad
        unset($user['contrasena']);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Inicio de sesión exitoso',
            'user' => $user
        ]);
    } else {
        // Contraseña incorrecta
        echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos']);
    }
} else {
    // Usuario no encontrado
    echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos']);
}

$stmt->close();
$conn->close();
?>