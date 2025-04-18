<?php
// Configurações de cabeçalho para permitir requisições de outros domínios
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json"); // Garantir que o conteúdo seja sempre JSON

// Desativar a exibição de erros para evitar que HTML seja incluído na resposta
ini_set('display_errors', 0);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

// Tempo limite de execução aumentado para processar uploads grandes
ini_set('max_execution_time', 300);
ini_set('memory_limit', '128M');

// Se for uma requisição OPTIONS (preflight), terminar aqui
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Função para registrar logs
function logMessage($message) {
    $logFile = 'upload_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Capturar erros em vez de exibi-los
function handleError($errno, $errstr, $errfile, $errline) {
    logMessage("Erro PHP: [$errno] $errstr em $errfile:$errline");
    return true;
}
set_error_handler('handleError');

// Obter parâmetros da requisição (POST ou GET)
function getParam($paramName, $default = '') {
    if (isset($_POST[$paramName])) {
        return $_POST[$paramName];
    } else if (isset($_GET[$paramName])) {
        return $_GET[$paramName];
    } else {
        return $default;
    }
}

try {
    // Registrar informações do método HTTP
    logMessage("Requisição recebida: método " . $_SERVER['REQUEST_METHOD']);
    
    // Verifica o tipo de ação
    $action = getParam('action');
    
    if (empty($action)) {
        logMessage("Nenhuma ação especificada");
        echo json_encode(['success' => false, 'message' => 'Nenhuma ação especificada']);
        exit;
    }
    
    logMessage("Ação solicitada: $action");

    // Processa o upload de imagens
    if ($action === 'uploadImage') {
        logMessage("Iniciando processo de upload de imagem");
        $imageType = getParam('type');
        
        if ($imageType !== 'logo' && $imageType !== 'profile') {
            logMessage("Tipo de imagem inválido: $imageType");
            echo json_encode(['success' => false, 'message' => 'Tipo de imagem inválido']);
            exit;
        }
        
        // Verifica se um arquivo foi enviado
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            $errorCode = isset($_FILES['image']) ? $_FILES['image']['error'] : 'Arquivo não enviado';
            $errorMessage = 'Erro no upload: ';
            
            switch ($errorCode) {
                case UPLOAD_ERR_INI_SIZE:
                    $errorMessage .= 'O arquivo excede o tamanho máximo permitido pelo PHP.';
                    break;
                case UPLOAD_ERR_FORM_SIZE:
                    $errorMessage .= 'O arquivo excede o tamanho máximo permitido pelo formulário.';
                    break;
                case UPLOAD_ERR_PARTIAL:
                    $errorMessage .= 'O arquivo foi apenas parcialmente enviado.';
                    break;
                case UPLOAD_ERR_NO_FILE:
                    $errorMessage .= 'Nenhum arquivo foi enviado.';
                    break;
                case UPLOAD_ERR_NO_TMP_DIR:
                    $errorMessage .= 'Falta uma pasta temporária.';
                    break;
                case UPLOAD_ERR_CANT_WRITE:
                    $errorMessage .= 'Falha ao escrever o arquivo no disco.';
                    break;
                default:
                    $errorMessage .= 'Erro desconhecido: ' . $errorCode;
            }
            
            logMessage($errorMessage);
            echo json_encode(['success' => false, 'message' => $errorMessage]);
            exit;
        }
        
        // Validar o tipo de arquivo
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $fileType = $_FILES['image']['type'];
        
        if (!in_array($fileType, $allowedTypes)) {
            logMessage("Tipo de arquivo não permitido: $fileType");
            echo json_encode(['success' => false, 'message' => 'Apenas imagens JPG, PNG e GIF são permitidas.']);
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
            logMessage("Backup de $fileName criado em $backupFileName");
        }
        
        // Move o arquivo enviado para o destino
        if (move_uploaded_file($_FILES['image']['tmp_name'], $fileName)) {
            logMessage("Imagem $imageType atualizada com sucesso: $fileName");
            echo json_encode([
                'success' => true, 
                'message' => 'Imagem atualizada com sucesso',
                'filename' => $fileName,
                'type' => $imageType
            ]);
        } else {
            logMessage("Erro ao salvar a imagem $imageType");
            echo json_encode([
                'success' => false, 
                'message' => 'Erro ao salvar a imagem. Verifique as permissões do servidor.'
            ]);
        }
    }
    // Atualiza a agenda
    elseif ($action === 'updateAgenda') {
        logMessage("Iniciando atualização da agenda");
        $agendaData = getParam('agenda');
        
        if (empty($agendaData)) {
            logMessage("Dados da agenda não fornecidos");
            echo json_encode(['success' => false, 'message' => 'Dados da agenda não fornecidos']);
            exit;
        }
        
        // Decodifica os dados JSON da agenda
        $agenda = json_decode($agendaData, true);
        
        if ($agenda === null) {
            $jsonError = json_last_error_msg();
            logMessage("Dados da agenda inválidos: $jsonError");
            echo json_encode([
                'success' => false, 
                'message' => 'Dados da agenda inválidos: ' . $jsonError
            ]);
            exit;
        }
        
        // Validação básica dos dados da agenda
        if (!isset($agenda['streams']) || !is_array($agenda['streams'])) {
            logMessage("Estrutura da agenda inválida: 'streams' não é um array");
            echo json_encode([
                'success' => false, 
                'message' => "Estrutura da agenda inválida: 'streams' não é um array"
            ]);
            exit;
        }
        
        // Validação adicional de cada stream
        foreach ($agenda['streams'] as $index => $stream) {
            if (!isset($stream['data']) || !isset($stream['horario']) || !isset($stream['titulo']) || !isset($stream['plataforma'])) {
                logMessage("Stream #$index tem campos obrigatórios faltando");
                echo json_encode([
                    'success' => false, 
                    'message' => "Stream #$index tem campos obrigatórios faltando"
                ]);
                exit;
            }
        }
        
        // Cria um backup do arquivo agenda.json
        $backupDir = 'backups';
        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
        }
        
        if (file_exists('agenda.json')) {
            $backupFileName = $backupDir . '/agenda_' . date('YmdHis') . '.json';
            copy('agenda.json', $backupFileName);
            logMessage("Backup da agenda criado em $backupFileName");
        }
        
        // Ordenar as streams por data e horário
        usort($agenda['streams'], function($a, $b) {
            $dateA = strtotime($a['data'] . ' ' . $a['horario']);
            $dateB = strtotime($b['data'] . ' ' . $b['horario']);
            return $dateA - $dateB;
        });
        
        // Garantir que o JSON seja válido
        $jsonData = json_encode($agenda, JSON_PRETTY_PRINT);
        if ($jsonData === false) {
            logMessage("Erro ao codificar dados para JSON: " . json_last_error_msg());
            echo json_encode([
                'success' => false, 
                'message' => 'Erro ao codificar dados para JSON: ' . json_last_error_msg()
            ]);
            exit;
        }
        
        // Salva os novos dados da agenda
        $writeResult = file_put_contents('agenda.json', $jsonData);
        if ($writeResult !== false) {
            logMessage("Agenda atualizada com sucesso: " . count($agenda['streams']) . " streams");
            echo json_encode([
                'success' => true, 
                'message' => 'Agenda atualizada com sucesso',
                'count' => count($agenda['streams']),
                'lastUpdate' => $agenda['ultimaAtualizacao'] ?? date('d/m/Y')
            ]);
        } else {
            logMessage("Erro ao salvar a agenda: resultado da escrita = " . var_export($writeResult, true));
            echo json_encode([
                'success' => false, 
                'message' => 'Erro ao salvar a agenda. Verifique as permissões do servidor.'
            ]);
        }
    }
    // Retorna informações básicas do sistema
    elseif ($action === 'getServerInfo') {
        $info = [
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Desconhecido',
            'max_upload_size' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
            'time' => date('Y-m-d H:i:s'),
            'timezone' => date_default_timezone_get(),
            'method' => $_SERVER['REQUEST_METHOD']
        ];
        
        echo json_encode([
            'success' => true,
            'info' => $info
        ]);
    }
    // Ação desconhecida
    else {
        logMessage("Ação desconhecida: $action");
        echo json_encode(['success' => false, 'message' => 'Ação desconhecida ou não especificada']);
    }
} catch (Exception $e) {
    logMessage("Exceção capturada: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Erro no servidor: ' . $e->getMessage()
    ]);
}
?> 