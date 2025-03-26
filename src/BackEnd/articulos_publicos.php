<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ufd";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'status' => 'error', 
        'message' => 'Connection failed: ' . $conn->connect_error
    ]));
}

// Ensure the script only responds to POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode([
        'status' => 'error', 
        'message' => 'Invalid request method'
    ]));
}

// Validate and extract form data
$tema = $_POST['topic'] ?? null;
$categoria = $_POST['category'] ?? null;
$descripcion = $_POST['description'] ?? null;
$palabras_clave = $_POST['keywords'] ?? null;
$urls = $_POST['urls'] ?? null;

// Validate required fields
if (!$tema || !$categoria) {
    die(json_encode([
        'status' => 'error', 
        'message' => 'Missing required fields'
    ]));
}

// Sanitize inputs
$tema = $conn->real_escape_string($tema);
$categoria = $conn->real_escape_string($categoria);
$descripcion = $descripcion ? $conn->real_escape_string($descripcion) : null;

// Handle keywords and URLs (they might be passed as JSON strings)
$palabras_clave = $palabras_clave ? json_encode(json_decode($palabras_clave, true)) : null;
$urls = $urls ? json_encode(json_decode($urls, true)) : null;

// Prepare SQL statement
$sql = "INSERT INTO articulos_publicos (
    fecha_publicacion, 
    tema, 
    categoria, 
    descripcion, 
    palabras_clave, 
    urls
) VALUES (
    NOW(), ?, ?, ?, ?, ?
)";

// Prepare and bind
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "sssss", 
    $tema, 
    $categoria, 
    $descripcion, 
    $palabras_clave, 
    $urls
);

// Execute the statement
if ($stmt->execute()) {
    echo json_encode([
        'status' => 'success', 
        'message' => 'Artículo público guardado exitosamente',
        'id' => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Error al guardar el artículo: ' . $stmt->error
    ]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>