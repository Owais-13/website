// IELTS Assessment JavaScript with OpenAI Integration

// Global variables
let currentAssessment = null;
let writingTimer = null;
let recordingStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let audioBlobs = {};

// OpenAI API Configuration
const OPENAI_API_KEY = window.CONFIG ? window.CONFIG.OPENAI.API_KEY : 'your-openai-api-key-here';
const OPENAI_API_URL = window.CONFIG ? window.CONFIG.OPENAI.API_URL : 'https://api.openai.com/v1/chat/completions';

// Assessment types
const ASSESSMENT_TYPES = {
    WRITING: 'writing',
    SPEAKING: 'speaking'
};

// Initialize the assessment system
document.addEventListener('DOMContentLoaded', function() {
    console.log('IELTS Assessment System Initialized');
    
    // Check if OpenAI API key is configured
    if (OPENAI_API_KEY === 'your-openai-api-key-here') {
        console.warn('Please configure your OpenAI API key in the JavaScript file');
        showNotification('Please configure OpenAI API key for full functionality', 'warning');
    }
});

// Navigation functions
function startWritingAssessment() {
    currentAssessment = ASSESSMENT_TYPES.WRITING;
    document.getElementById('assessment-selection').style.display = 'none';
    document.getElementById('writing-assessment').style.display = 'block';
    startWritingTimer();
}

function startSpeakingAssessment() {
    currentAssessment = ASSESSMENT_TYPES.SPEAKING;
    document.getElementById('assessment-selection').style.display = 'none';
    document.getElementById('speaking-assessment').style.display = 'block';
}

function backToSelection() {
    currentAssessment = null;
    stopWritingTimer();
    resetRecording();
    
    document.getElementById('assessment-selection').style.display = 'block';
    document.getElementById('writing-assessment').style.display = 'none';
    document.getElementById('speaking-assessment').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('loading-section').style.display = 'none';
}

// Timer functions
function startWritingTimer() {
    let timeLeft = 60 * 60; // 60 minutes in seconds
    const timerElement = document.getElementById('writing-timer');
    
    writingTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `Time Remaining: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            stopWritingTimer();
            alert('Time is up! Your assessment will be submitted automatically.');
            submitWritingAssessment();
        }
        timeLeft--;
    }, 1000);
}

function stopWritingTimer() {
    if (writingTimer) {
        clearInterval(writingTimer);
        writingTimer = null;
    }
}

// Recording functions
async function toggleRecording(partNumber) {
    const recordBtn = document.getElementById(`record-btn-${partNumber}`);
    const statusSpan = document.getElementById(`recording-status-${partNumber}`);
    const audioPlayer = document.getElementById(`audio-player-${partNumber}`);
    
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        // Start recording
        try {
            recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(recordingStream);
            recordedChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
                audioBlobs[partNumber] = audioBlob;
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayer.src = audioUrl;
                audioPlayer.style.display = 'block';
            };
            
            mediaRecorder.start();
            recordBtn.textContent = 'Stop Recording';
            recordBtn.classList.add('recording');
            statusSpan.textContent = 'Recording...';
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            showNotification('Error accessing microphone. Please check permissions.', 'error');
        }
    } else {
        // Stop recording
        mediaRecorder.stop();
        recordingStream.getTracks().forEach(track => track.stop());
        
        recordBtn.textContent = 'Start Recording';
        recordBtn.classList.remove('recording');
        statusSpan.textContent = 'Recording saved';
    }
}

function resetRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    if (recordingStream) {
        recordingStream.getTracks().forEach(track => track.stop());
    }
    recordedChunks = [];
    audioBlobs = {};
}

// Assessment submission functions
async function submitWritingAssessment() {
    const task1Response = document.getElementById('writing-task1').value.trim();
    const task2Response = document.getElementById('writing-task2').value.trim();
    
    if (!task1Response && !task2Response) {
        showNotification('Please provide at least one response before submitting.', 'warning');
        return;
    }
    
    stopWritingTimer();
    showLoading();
    
    try {
        const assessmentData = {
            type: 'writing',
            task1: task1Response,
            task2: task2Response,
            wordCount: {
                task1: task1Response.split(' ').length,
                task2: task2Response.split(' ').length
            }
        };
        
        const result = await assessWithOpenAI(assessmentData);
        displayResults(result);
        
    } catch (error) {
        console.error('Error submitting writing assessment:', error);
        showNotification('Error processing assessment. Please try again.', 'error');
        hideLoading();
    }
}

async function submitSpeakingAssessment() {
    const hasRecordings = Object.keys(audioBlobs).length > 0;
    
    if (!hasRecordings) {
        showNotification('Please record at least one speaking response before submitting.', 'warning');
        return;
    }
    
    showLoading();
    
    try {
        // For demo purposes, we'll simulate speaking assessment
        // In a real implementation, you would send audio files to OpenAI's Whisper API
        // and then assess the transcribed text
        
        const assessmentData = {
            type: 'speaking',
            recordings: audioBlobs,
            parts: Object.keys(audioBlobs).length
        };
        
        const result = await assessSpeakingWithOpenAI(assessmentData);
        displayResults(result);
        
    } catch (error) {
        console.error('Error submitting speaking assessment:', error);
        showNotification('Error processing assessment. Please try again.', 'error');
        hideLoading();
    }
}

// OpenAI Integration
async function assessWithOpenAI(assessmentData) {
    if (OPENAI_API_KEY === 'your-openai-api-key-here') {
        // Return mock data for demo purposes
        return generateMockResults(assessmentData);
    }
    
    const prompt = createWritingAssessmentPrompt(assessmentData);
    
    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert IELTS examiner with extensive experience in assessing writing tasks. Provide detailed scoring and feedback according to IELTS band descriptors.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 2000
        })
    });
    
    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    return parseOpenAIResponse(data.choices[0].message.content);
}

async function assessSpeakingWithOpenAI(assessmentData) {
    if (OPENAI_API_KEY === 'your-openai-api-key-here') {
        // Return mock data for demo purposes
        return generateMockSpeakingResults(assessmentData);
    }
    
    // In a real implementation, you would:
    // 1. Convert audio to text using OpenAI's Whisper API
    // 2. Assess the transcribed text using GPT-4
    // 3. Return structured results
    
    const prompt = createSpeakingAssessmentPrompt(assessmentData);
    
    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert IELTS speaking examiner. Assess the speaking performance based on fluency, pronunciation, vocabulary, and grammar.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 2000
        })
    });
    
    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    return parseOpenAIResponse(data.choices[0].message.content);
}

// Prompt creation functions
function createWritingAssessmentPrompt(assessmentData) {
    return `
Please assess the following IELTS Writing responses and provide detailed scoring and feedback.

Task 1 Response (${assessmentData.wordCount.task1} words):
${assessmentData.task1}

Task 2 Response (${assessmentData.wordCount.task2} words):
${assessmentData.task2}

Please provide:
1. Overall band score (0-9)
2. Individual scores for:
   - Task Achievement (0-9)
   - Coherence and Cohesion (0-9)
   - Lexical Resource (0-9)
   - Grammatical Range and Accuracy (0-9)
3. Detailed feedback for each criterion
4. Specific suggestions for improvement

Format your response as JSON with the following structure:
{
  "overall_band": 6.5,
  "task_achievement": 6.0,
  "coherence_cohesion": 7.0,
  "lexical_resource": 6.5,
  "grammatical_range": 6.0,
  "feedback": {
    "task_achievement": "Detailed feedback...",
    "coherence_cohesion": "Detailed feedback...",
    "lexical_resource": "Detailed feedback...",
    "grammatical_range": "Detailed feedback..."
  },
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}
`;
}

function createSpeakingAssessmentPrompt(assessmentData) {
    return `
Please assess the following IELTS Speaking performance and provide detailed scoring and feedback.

Speaking Parts Completed: ${assessmentData.parts}/3

Please provide:
1. Overall band score (0-9)
2. Individual scores for:
   - Fluency and Coherence (0-9)
   - Lexical Resource (0-9)
   - Grammatical Range and Accuracy (0-9)
   - Pronunciation (0-9)
3. Detailed feedback for each criterion
4. Specific suggestions for improvement

Format your response as JSON with the following structure:
{
  "overall_band": 6.5,
  "fluency_coherence": 6.0,
  "lexical_resource": 7.0,
  "grammatical_range": 6.5,
  "pronunciation": 6.0,
  "feedback": {
    "fluency_coherence": "Detailed feedback...",
    "lexical_resource": "Detailed feedback...",
    "grammatical_range": "Detailed feedback...",
    "pronunciation": "Detailed feedback..."
  },
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}
`;
}

// Response parsing
function parseOpenAIResponse(responseText) {
    try {
        // Extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('No JSON found in response');
        }
    } catch (error) {
        console.error('Error parsing OpenAI response:', error);
        return generateMockResults({ type: 'writing' });
    }
}

// Mock data generation for demo purposes
function generateMockResults(assessmentData) {
    const baseScore = 6.5;
    const variation = 0.5;
    
    return {
        overall_band: baseScore,
        task_achievement: baseScore + (Math.random() - 0.5) * variation,
        coherence_cohesion: baseScore + (Math.random() - 0.5) * variation,
        lexical_resource: baseScore + (Math.random() - 0.5) * variation,
        grammatical_range: baseScore + (Math.random() - 0.5) * variation,
        feedback: {
            task_achievement: "Your response addresses the task requirements adequately. You have included the main features and made some relevant comparisons. To improve, try to include more specific data points and ensure all key information is covered.",
            coherence_cohesion: "Your writing flows logically with good use of cohesive devices. Paragraphs are well-organized. Consider using a wider range of linking words and ensuring smoother transitions between ideas.",
            lexical_resource: "You demonstrate a good range of vocabulary appropriate for the task. Some sophisticated words are used effectively. To enhance your score, try incorporating more academic vocabulary and avoiding repetition.",
            grammatical_range: "You show a good range of grammatical structures with mostly accurate usage. Some complex sentences are attempted. Focus on improving accuracy and using more varied sentence structures."
        },
        suggestions: [
            "Practice writing under time pressure to improve speed and efficiency",
            "Read more academic texts to expand your vocabulary range",
            "Review grammar rules, especially article usage and verb tenses",
            "Practice planning your response before writing to ensure better organization"
        ]
    };
}

function generateMockSpeakingResults(assessmentData) {
    const baseScore = 6.0;
    const variation = 0.5;
    
    return {
        overall_band: baseScore,
        fluency_coherence: baseScore + (Math.random() - 0.5) * variation,
        lexical_resource: baseScore + (Math.random() - 0.5) * variation,
        grammatical_range: baseScore + (Math.random() - 0.5) * variation,
        pronunciation: baseScore + (Math.random() - 0.5) * variation,
        feedback: {
            fluency_coherence: "You speak with reasonable fluency, though there are some hesitations. Your ideas are generally well-connected. Practice speaking more naturally and reducing pauses.",
            lexical_resource: "You use a good range of vocabulary appropriate to the topics. Some sophisticated words are used effectively. Try to incorporate more idiomatic expressions.",
            grammatical_range: "You demonstrate a good range of grammatical structures with mostly accurate usage. Some complex sentences are attempted. Focus on improving accuracy.",
            pronunciation: "Your pronunciation is generally clear and understandable. Some words could be pronounced more naturally. Practice stress and intonation patterns."
        },
        suggestions: [
            "Practice speaking regularly with native speakers or language partners",
            "Record yourself speaking and analyze your pronunciation",
            "Learn and practice common IELTS speaking topics",
            "Work on reducing hesitations and filler words"
        ]
    };
}

// Display functions
function displayResults(results) {
    hideLoading();
    
    // Update score display
    document.getElementById('overall-score').textContent = results.overall_band.toFixed(1);
    
    if (currentAssessment === ASSESSMENT_TYPES.WRITING) {
        document.getElementById('task-score').textContent = results.task_achievement.toFixed(1);
        document.getElementById('coherence-score').textContent = results.coherence_cohesion.toFixed(1);
        document.getElementById('lexical-score').textContent = results.lexical_resource.toFixed(1);
        document.getElementById('grammar-score').textContent = results.grammatical_range.toFixed(1);
    } else {
        document.getElementById('task-score').textContent = results.fluency_coherence.toFixed(1);
        document.getElementById('coherence-score').textContent = results.lexical_resource.toFixed(1);
        document.getElementById('lexical-score').textContent = results.grammatical_range.toFixed(1);
        document.getElementById('grammar-score').textContent = results.pronunciation.toFixed(1);
    }
    
    // Update feedback content
    const feedbackContent = document.getElementById('feedback-content');
    feedbackContent.innerHTML = '';
    
    // Add feedback items
    Object.entries(results.feedback).forEach(([criterion, feedback]) => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        feedbackItem.innerHTML = `
            <h5>${criterion.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h5>
            <p>${feedback}</p>
        `;
        feedbackContent.appendChild(feedbackItem);
    });
    
    // Add suggestions
    if (results.suggestions && results.suggestions.length > 0) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'feedback-item';
        suggestionsDiv.innerHTML = `
            <h5>Suggestions for Improvement</h5>
            <ul>
                ${results.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
        `;
        feedbackContent.appendChild(suggestionsDiv);
    }
    
    // Show results section
    document.getElementById('writing-assessment').style.display = 'none';
    document.getElementById('speaking-assessment').style.display = 'none';
    document.getElementById('results-section').style.display = 'block';
}

// Utility functions
function showLoading() {
    document.getElementById('writing-assessment').style.display = 'none';
    document.getElementById('speaking-assessment').style.display = 'none';
    document.getElementById('loading-section').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading-section').style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Word count functionality
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('response-area')) {
        const wordCount = e.target.value.split(' ').filter(word => word.length > 0).length;
        const taskId = e.target.id;
        
        // Update word count display if it exists
        const wordCountElement = document.getElementById(`${taskId}-wordcount`);
        if (wordCountElement) {
            wordCountElement.textContent = `Word count: ${wordCount}`;
        }
    }
});

// Export functions for global access
window.startWritingAssessment = startWritingAssessment;
window.startSpeakingAssessment = startSpeakingAssessment;
window.backToSelection = backToSelection;
window.toggleRecording = toggleRecording;
window.submitWritingAssessment = submitWritingAssessment;
window.submitSpeakingAssessment = submitSpeakingAssessment;