<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

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
    $sql = "SELECT id AS id_publico, fecha_publicacion, tema AS tema_publico, categoria AS categoria_publica, descripcion AS descripcion_publico, palabras_clave, urls, archivos FROM articulos_publicos";

    // Execute query
    $result = $conn->query($sql);

    // Prepare publications array
    $publicaciones = [];

    // Fetch results
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Clean each field
            $row['tema_publico'] = cleanRetrievedData($row['tema_publico']);
            $row['categoria_publica'] = cleanRetrievedData($row['categoria_publica']);
            $row['descripcion_publico'] = cleanRetrievedData($row['descripcion_publico']);
            
            // Process palavras_clave (keywords)
            if (!empty($row['palabras_clave'])) {
                // Try JSON decode first
                $decoded = json_decode($row['palabras_clave'], true);
                if (is_array($decoded)) {
                    $row['palabras_clave'] = $decoded;
                } else if (is_string($row['palabras_clave'])) {
                    // If not valid JSON, split by comma
                    $row['palabras_clave'] = array_map('trim', explode(',', $row['palabras_clave']));
                } else {
                    $row['palabras_clave'] = [];
                }
            } else {
                $row['palabras_clave'] = [];
            }
            
            // Process URLs
            if (!empty($row['urls'])) {
                $decoded = json_decode($row['urls'], true);
                if (is_array($decoded)) {
                    $row['urls'] = $decoded;
                } else if (is_string($row['urls'])) {
                    $row['urls'] = array_map('trim', explode(',', $row['urls']));
                } else {
                    $row['urls'] = [];
                }
            } else {
                $row['urls'] = [];
            }
            
            // Process files
            if (!empty($row['archivos'])) {
                $decoded = json_decode($row['archivos'], true);
                if (is_array($decoded)) {
                    $row['archivos'] = $decoded;
                } else if (is_string($row['archivos'])) {
                    $row['archivos'] = array_map('trim', explode(',', $row['archivos']));
                } else {
                    $row['archivos'] = [];
                }
            } else {
                $row['archivos'] = [];
            }
            
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