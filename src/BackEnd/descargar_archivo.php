<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

// Directorio donde se almacenan los archivos
$uploadDirectory = __DIR__ . '/uploads/';

// Obtener el nombre del archivo a descargar
$filename = isset($_GET['archivo']) ? basename($_GET['archivo']) : null;

if (!$filename) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Nombre de archivo no proporcionado']);
    exit;
}

// Ruta completa del archivo
$filepath = $uploadDirectory . $filename;

// Verificar que el archivo exista y sea legible
if (!file_exists($filepath) || !is_readable($filepath)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Archivo no encontrado']);
    exit;
}

// Alternativa a finfo_open() - usar la extensión del archivo para determinar el tipo MIME
$extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$mimeTypes = [  
    'txt' => 'text/plain',
    'pdf' => 'application/pdf',
    'doc' => 'application/msword',
    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls' => 'application/vnd.ms-excel',
    'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Asignar tipo MIME basado en la extensión o usar un tipo genérico si no está en la lista
$mimeType = isset($mimeTypes[$extension]) ? $mimeTypes[$extension] : 'application/octet-stream';

// Configurar headers para forzar la descarga
header('Content-Description: File Transfer');
header('Content-Type: ' . $mimeType);
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($filepath));

// Limpiar el buffer de salida y leer el archivo
flush();
readfile($filepath);
exit;
?>