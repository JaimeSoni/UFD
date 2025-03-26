<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

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
$fecha_publicacion = $_POST['date'] ?? null; // Esto debería ser en formato YYYY-MM-DD
$tema = $_POST['topic'] ?? null;
$categoria = $_POST['category'] ?? null;
$descripcion = $_POST['description'] ?? null;
$palabras_clave = $_POST['keywords'] ?? null;
$urls = $_POST['urls'] ?? null;

// Validate required fields
if (!$fecha_publicacion || !$tema || !$categoria) {
    die(json_encode([
        'status' => 'error', 
        'message' => 'Missing required fields'
    ]));
}

// Sanitize inputs
$fecha_publicacion = $conn->real_escape_string($fecha_publicacion); // Asegúrate de que esto esté en el formato correcto
$tema = $conn->real_escape_string($tema);
$categoria = $conn->real_escape_string($categoria);
$descripcion = $descripcion ? $conn->real_escape_string($descripcion) : null;

// Handle keywords and URLs (they might be passed as JSON strings)
$palabras_clave = $palabras_clave ? json_encode(json_decode($palabras_clave, true)) : null;
$urls = $urls ? json_encode(json_decode($urls, true)) : null;

// Handle file uploads
$archivos = [];
if (isset($_FILES['files'])) {
    $upload_dir = 'uploads/';
    
    // Create uploads directory if it doesn't exist
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    foreach ($_FILES['files']['name'] as $key => $filename) {
        $tmp_name = $_FILES['files']['tmp_name'][$key];
        $file_size = $_FILES['files']['size'][$key];
        $file_error = $_FILES['files']['error'][$key];

        // File validation
        $allowed_types = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
        $max_file_size = 5 * 1024 * 1024; // 5MB

        $file_ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        if ($file_size > $max_file_size) {
            continue; // Skip files larger than 5MB
        }

        if (!in_array($file_ext, $allowed_types)) {
            continue; // Skip files with invalid extensions
        }

        $new_filename = uniqid() . '_' . $filename;
        $destination = $upload_dir . $new_filename;
        
        if (move_uploaded_file($tmp_name, $destination)) {
            $archivos[] = $new_filename;
        }
    }
}
$archivos_json = !empty($archivos) ? json_encode($archivos) : null;

// Prepare SQL statement
$sql = "INSERT INTO articulos_publicos (
    fecha_publicacion, 
    tema, 
    categoria, 
    descripcion, 
    palabras_clave, 
    urls, 
    archivos
) VALUES (
    ?, ?, ?, ?, ?, ?, ?
)";

// Prepare and bind
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "sssssss", 
    $fecha_publicacion, 
    $tema, 
    $categoria, 
    $descripcion, 
    $palabras_clave, 
    $urls, 
    $archivos_json
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