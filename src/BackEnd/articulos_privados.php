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

// Function to clean input
function cleanInput($input) {
    // Remove surrounding quotes
    $input = trim($input, '"\'');
    
    // Remove escaped quotes
    $input = str_replace(['\"', "\'"], '', $input);
    
    // Remove backslashes
    $input = stripslashes($input);
    
    return $input;
}

// File upload handling function
function handleFileUpload($files) {
    $uploadDir = 'uploads/'; // Directory to store uploaded files
    
    // Create uploads directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $uploadedFiles = [];
    
    foreach ($files as $file) {
        // Generate unique filename
        $filename = uniqid() . '_' . basename($file['name']);
        $targetFilePath = $uploadDir . $filename;
        
        // Check file size (5MB limit)
        if ($file['size'] > 5 * 1024 * 1024) {
            continue; // Skip files larger than 5MB
        }
        
        // Allowed file types
        $allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
        $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        
        if (in_array($fileExtension, $allowedTypes)) {
            if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
                $uploadedFiles[] = $targetFilePath;
            }
        }
    }
    
    return json_encode($uploadedFiles);
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

// Clean inputs
$tema = cleanInput($tema);
$categoria = cleanInput($categoria);
$descripcion = $descripcion ? cleanInput($descripcion) : null;

// Sanitize inputs
$tema = $conn->real_escape_string($tema);
$categoria = $conn->real_escape_string($categoria);
$descripcion = $descripcion ? $conn->real_escape_string($descripcion) : null;

// Handle keywords and URLs
$palabras_clave = $palabras_clave ? 
    (is_string($palabras_clave) ? json_encode(json_decode($palabras_clave, true)) : json_encode($palabras_clave)) 
    : '[]';
$urls = $urls ? 
    (is_string($urls) ? json_encode(json_decode($urls, true)) : json_encode($urls)) 
    : '[]';

// Handle file uploads
$archivos = '[]';
if (!empty($_FILES['files'])) {
    $uploadedFiles = [];
    $fileCount = count($_FILES['files']['name']);
    
    for ($i = 0; $i < $fileCount; $i++) {
        $uploadedFiles[] = [
            'name' => $_FILES['files']['name'][$i],
            'type' => $_FILES['files']['type'][$i],
            'tmp_name' => $_FILES['files']['tmp_name'][$i],
            'error' => $_FILES['files']['error'][$i],
            'size' => $_FILES['files']['size'][$i]
        ];
    }
    
    $archivos = handleFileUpload($uploadedFiles);
}

// Prepare SQL statement
$sql = "INSERT INTO articulos_privados (
    fecha_publicacion,
    tema,
    categoria,
    descripcion,
    palabras_clave,
    urls,
    archivos
) VALUES (
    NOW(), ?, ?, ?, ?, ?, ?
)";

// Prepare and bind
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "ssssss",
    $tema,
    $categoria,
    $descripcion,
    $palabras_clave,
    $urls,
    $archivos
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