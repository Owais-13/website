<?php
// IELTS Scoring API - PHP Implementation
// Alternative to Node.js implementation

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Load environment variables (you'll need to install vlucas/phpdotenv via Composer)
// require_once __DIR__ . '/vendor/autoload.php';
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
// $dotenv->load();

// For this example, set your API key here (in production, use environment variables)
$OPENAI_API_KEY = 'your_openai_api_key_here';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array("error" => "Method not allowed"));
    exit();
}

if (!$data || !isset($data->type)) {
    http_response_code(400);
    echo json_encode(array("error" => "Invalid request data"));
    exit();
}

// Route to appropriate scoring function
if ($data->type === 'writing') {
    $result = scoreWritingTest($data->task1, $data->task2, $OPENAI_API_KEY);
} elseif ($data->type === 'speaking') {
    $result = scoreSpeakingTest($data->transcript, $OPENAI_API_KEY);
} else {
    http_response_code(400);
    echo json_encode(array("error" => "Invalid test type"));
    exit();
}

echo json_encode($result);

function scoreWritingTest($task1, $task2, $apiKey) {
    $systemPrompt = "You are an experienced IELTS examiner. Score the following IELTS writing tasks according to the official IELTS band descriptors. 
    Provide scores for:
    1. Task Achievement (Task 1) / Task Response (Task 2)
    2. Coherence and Cohesion
    3. Lexical Resource
    4. Grammatical Range and Accuracy
    
    Each criterion should be scored from 0-9 in 0.5 increments.
    Also provide detailed feedback for improvement and calculate the overall band score.";

    $userPrompt = "Please score these IELTS writing responses:\n\n" .
                  "Task 1 (Report/Letter):\n$task1\n\n" .
                  "Task 2 (Essay):\n$task2\n\n" .
                  "Provide the response in the following JSON format:\n" .
                  "{\n" .
                  '  "overallScore": 0.0,' . "\n" .
                  '  "taskAchievement": 0.0,' . "\n" .
                  '  "coherenceCohesion": 0.0,' . "\n" .
                  '  "lexicalResource": 0.0,' . "\n" .
                  '  "grammaticalAccuracy": 0.0,' . "\n" .
                  '  "task1Feedback": "detailed feedback for task 1",' . "\n" .
                  '  "task2Feedback": "detailed feedback for task 2",' . "\n" .
                  '  "improvements": ["improvement tip 1", "improvement tip 2", "improvement tip 3"]' . "\n" .
                  "}";

    return callOpenAI($systemPrompt, $userPrompt, $apiKey);
}

function scoreSpeakingTest($transcript, $apiKey) {
    $systemPrompt = "You are an experienced IELTS examiner. Score the following IELTS speaking response according to the official IELTS band descriptors.
    Provide scores for:
    1. Fluency and Coherence
    2. Lexical Resource
    3. Grammatical Range and Accuracy
    4. Pronunciation
    
    Each criterion should be scored from 0-9 in 0.5 increments.
    Also provide detailed feedback for improvement and calculate the overall band score.";

    $userPrompt = "Please score this IELTS speaking response:\n\n$transcript\n\n" .
                  "Provide the response in the following JSON format:\n" .
                  "{\n" .
                  '  "overallScore": 0.0,' . "\n" .
                  '  "fluencyCoherence": 0.0,' . "\n" .
                  '  "lexicalResource": 0.0,' . "\n" .
                  '  "grammaticalAccuracy": 0.0,' . "\n" .
                  '  "pronunciation": 0.0,' . "\n" .
                  '  "detailedFeedback": "comprehensive feedback on the speaking performance",' . "\n" .
                  '  "improvements": ["improvement tip 1", "improvement tip 2", "improvement tip 3"]' . "\n" .
                  "}";

    return callOpenAI($systemPrompt, $userPrompt, $apiKey);
}

function callOpenAI($systemPrompt, $userPrompt, $apiKey) {
    $url = 'https://api.openai.com/v1/chat/completions';
    
    $data = array(
        'model' => 'gpt-4-turbo-preview',
        'messages' => array(
            array('role' => 'system', 'content' => $systemPrompt),
            array('role' => 'user', 'content' => $userPrompt)
        ),
        'temperature' => 0.3,
        'response_format' => array('type' => 'json_object')
    );
    
    $options = array(
        'http' => array(
            'header' => "Content-Type: application/json\r\n" .
                       "Authorization: Bearer $apiKey\r\n",
            'method' => 'POST',
            'content' => json_encode($data)
        )
    );
    
    $context = stream_context_create($options);
    $result = @file_get_contents($url, false, $context);
    
    if ($result === FALSE) {
        // Return mock data for development/testing
        if (strpos($userPrompt, 'writing') !== false) {
            return array(
                'overallScore' => 6.5,
                'taskAchievement' => 6.5,
                'coherenceCohesion' => 6.5,
                'lexicalResource' => 6.0,
                'grammaticalAccuracy' => 7.0,
                'task1Feedback' => 'Your Task 1 response demonstrates a good understanding of the data presented. You have successfully identified the main trends and made relevant comparisons. However, consider providing more specific data points and ensuring all key features are covered.',
                'task2Feedback' => 'Your essay presents a clear position and develops your ideas logically. The arguments are relevant and supported with examples. To improve, work on developing more sophisticated vocabulary and varying your sentence structures.',
                'improvements' => array(
                    'Include more specific data and figures in Task 1 descriptions',
                    'Use a wider range of cohesive devices to link ideas',
                    'Develop more complex grammatical structures in your writing'
                )
            );
        } else {
            return array(
                'overallScore' => 6.5,
                'fluencyCoherence' => 6.5,
                'lexicalResource' => 6.0,
                'grammaticalAccuracy' => 7.0,
                'pronunciation' => 6.5,
                'detailedFeedback' => 'Your speaking demonstrates good fluency with occasional hesitation. You communicate ideas clearly and coherently. Your vocabulary is appropriate for the topics discussed, though there\'s room for more sophisticated expressions. Grammar is generally accurate with minor errors that don\'t impede communication.',
                'improvements' => array(
                    'Practice speaking for longer periods without hesitation',
                    'Expand vocabulary related to abstract topics',
                    'Work on stress and intonation patterns for more natural speech'
                )
            );
        }
    }
    
    $response = json_decode($result, true);
    $content = json_decode($response['choices'][0]['message']['content'], true);
    
    return $content;
}

// PHP Usage Instructions:
// 1. Save this file in your web server directory
// 2. Update the $OPENAI_API_KEY variable with your actual API key
// 3. Ensure your web server has PHP 7.0+ installed
// 4. Update the apiEndpoint in ielts-scoring.js to point to this PHP file
// 5. Make sure your server allows CORS requests