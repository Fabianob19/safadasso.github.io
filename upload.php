<?php
// Configurações de cabeçalho para permitir requisições de outros domínios
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Função para registrar logs
function logMessage($message) {
    $logFile = 'upload_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Verifica o tipo de ação
$action = isset($_POST['action']) ? $_POST['action'] : '';

// Processa o upload de imagens
if ($action === 'uploadImage') {
    $imageType = isset($_POST['type']) ? $_POST['type'] : '';
    
    if ($imageType !== 'logo' && $imageType !== 'profile') {
        echo json_encode(['success' => false, 'message' => 'Tipo de imagem inválido']);
        exit;
    }
    
    // Verifica se um arquivo foi enviado
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        $errorMessage = isset($_FILES['image']) ? 'Erro: ' . $_FILES['image']['error'] : 'Nenhum arquivo enviado';
        logMessage($errorMessage);
        echo json_encode(['success' => false, 'message' => $errorMessage]);
        exit;
    }
    
    // Define o nome do arquivo baseado no tipo
    $fileName = ($imageType === 'logo') ? 'logo-safadasso.png' : 'perfil-andre.jpg';
    
    // Salva um backup da imagem atual
    $backupDir = 'backups';
    if (!is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    
    if (file_exists($fileName)) {
        $backupFileName = $backupDir . '/' . pathinfo($fileName, PATHINFO_FILENAME) . '_' . date('YmdHis') . '.' . pathinfo($fileName, PATHINFO_EXTENSION);
        copy($fileName, $backupFileName);
    }
    
    // Move o arquivo enviado para o destino
    if (move_uploaded_file($_FILES['image']['tmp_name'], $fileName)) {
        logMessage("Imagem $imageType atualizada com sucesso");
        echo json_encode(['success' => true, 'message' => 'Imagem atualizada com sucesso']);
    } else {
        logMessage("Erro ao salvar a imagem $imageType");
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar a imagem']);
    }
}
// Atualiza a agenda
elseif ($action === 'updateAgenda') {
    $agendaData = isset($_POST['agenda']) ? $_POST['agenda'] : '';
    
    if (empty($agendaData)) {
        echo json_encode(['success' => false, 'message' => 'Dados da agenda não fornecidos']);
        exit;
    }
    
    // Decodifica os dados JSON da agenda
    $agenda = json_decode($agendaData, true);
    
    if ($agenda === null) {
        echo json_encode(['success' => false, 'message' => 'Dados da agenda inválidos']);
        exit;
    }
    
    // Cria um backup do arquivo agenda.json
    $backupDir = 'backups';
    if (!is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    
    if (file_exists('agenda.json')) {
        $backupFileName = $backupDir . '/agenda_' . date('YmdHis') . '.json';
        copy('agenda.json', $backupFileName);
    }
    
    // Salva os novos dados da agenda
    if (file_put_contents('agenda.json', json_encode($agenda, JSON_PRETTY_PRINT))) {
        logMessage("Agenda atualizada com sucesso");
        echo json_encode(['success' => true, 'message' => 'Agenda atualizada com sucesso']);
    } else {
        logMessage("Erro ao salvar a agenda");
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar a agenda']);
    }
}
// Ação desconhecida
else {
    echo json_encode(['success' => false, 'message' => 'Ação desconhecida']);
}
?> 