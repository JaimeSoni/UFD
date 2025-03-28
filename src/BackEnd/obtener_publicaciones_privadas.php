<?php
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    header("Access-Control-Allow-Origin: *");
}

// Allow specific HTTP methods
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Allow credentials if needed
header("Access-Control-Allow-Credentials: true");

// Respond to preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure JSON content type
header('Content-Type: application/json; charset=utf-8');

// Database connection
$host = 'localhost';
$db = 'ufd'; 
$user = 'root'; 
$pass = ''; 

// Create connection
try {
    $conn = new mysqli($host, $user, $pass, $db);

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Set character set to utf8
    $conn->set_charset("utf8mb4");

    // Function to clean retrieved data
    function cleanRetrievedData($input) {
        if (is_null($input)) return null;
        
        // Remove surrounding quotes and backslashes
        $input = trim($input, '"\'');
        $input = str_replace(['\"', "\'"], '', $input);
        $input = stripslashes($input);
        
        return $input;
    }

    // Prepare SQL query
    $sql = "SELECT 
                id AS id_privado, 
                fecha_publicacion AS fecha_privado, 
                tema AS tema_privado, 
                categoria AS categoria_privada,
                descripcion AS descripcion_privada,
                palabras_clave,
                urls
            FROM articulos_privados";

    // Execute query
    $result = $conn->query($sql);

    // Prepare publications array
    $publicaciones = [];

    // Fetch results
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Clean each field
            $row['tema_privado'] = cleanRetrievedData($row['tema_privado']);
            $row['categoria_privada'] = cleanRetrievedData($row['categoria_privada']);
            $row['descripcion_privada'] = cleanRetrievedData($row['descripcion_privada']);
            
            // Ensure JSON fields are properly parsed
            $row['palabras_clave'] = json_decode($row['palabras_clave'], true) ?? [];
            $row['urls'] = json_decode($row['urls'], true) ?? [];
            
            $publicaciones[] = $row;
        }

        // Successful response
        echo json_encode([
            'success' => true, 
            'publicaciones' => $publicaciones
        ], JSON_UNESCAPED_UNICODE);
    } else {
        // No results
        echo json_encode([
            'success' => true, 
            'publicaciones' => []
        ]);
    }

} catch (Exception $e) {
    // Error handling
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => $e->getMessage()
    ]);
} finally {
    // Close connection if it exists
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>