// IELTS Assessment JavaScript
let currentStep = 'welcome-step';
let assessmentData = {
    listening: { answers: [], score: 0 },
    reading: { answers: [], score: 0 },
    writing: { essay: '', score: 0 },
    speaking: { recordings: [], score: 0 }
};

// Configuration for OpenAI API
const OPENAI_CONFIG = {
    apiKey: '', // Will be set by user
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4'
};

// Initialize assessment
document.addEventListener('DOMContentLoaded', function() {
    initializeAssessment();
    setupEventListeners();
});

function initializeAssessment() {
    // Set up option button listeners
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove selected class from siblings
            const siblings = this.parentElement.querySelectorAll('.option-btn');
            siblings.forEach(sib => sib.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
        });
    });

    // Set up word count for writing
    const writingEssay = document.getElementById('writingEssay');
    if (writingEssay) {
        writingEssay.addEventListener('input', updateWordCount);
    }
}

function setupEventListeners() {
    // Progress bar updates
    window.addEventListener('scroll', updateProgressBar);
}

function startAssessment() {
    nextStep('listening-step');
}

function nextStep(stepId) {
    // Save current step data
    saveCurrentStepData();
    
    // Hide current step
    document.querySelector('.assessment-step.active').classList.remove('active');
    
    // Show next step
    document.getElementById(stepId).classList.add('active');
    
    // Update progress bar
    updateProgressBar();
    
    currentStep = stepId;
}

function saveCurrentStepData() {
    switch(currentStep) {
        case 'listening-step':
            saveListeningData();
            break;
        case 'reading-step':
            saveReadingData();
            break;
        case 'writing-step':
            saveWritingData();
            break;
        case 'speaking-step':
            saveSpeakingData();
            break;
    }
}

function saveListeningData() {
    const answers = [];
    document.querySelectorAll('#listeningQuestions .option-btn.selected').forEach(btn => {
        answers.push({
            question: btn.closest('.question').querySelector('h5').textContent,
            answer: btn.textContent,
            correct: btn.getAttribute('data-correct') === 'true'
        });
    });
    assessmentData.listening.answers = answers;
    assessmentData.listening.score = calculateListeningScore(answers);
}

function saveReadingData() {
    const answers = [];
    document.querySelectorAll('#readingQuestions .option-btn.selected').forEach(btn => {
        answers.push({
            question: btn.closest('.question').querySelector('h5').textContent,
            answer: btn.textContent,
            correct: btn.getAttribute('data-correct') === 'true'
        });
    });
    assessmentData.reading.answers = answers;
    assessmentData.reading.score = calculateReadingScore(answers);
}

function saveWritingData() {
    const essay = document.getElementById('writingEssay').value;
    assessmentData.writing.essay = essay;
    assessmentData.writing.score = calculateWritingScore(essay);
}

function saveSpeakingData() {
    // Speaking data is saved during recording
    assessmentData.speaking.score = calculateSpeakingScore(assessmentData.speaking.recordings);
}

function calculateListeningScore(answers) {
    const correctAnswers = answers.filter(answer => answer.correct).length;
    const totalQuestions = 3;
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    // Convert percentage to IELTS band score (6.0-9.0)
    if (percentage >= 90) return 9.0;
    if (percentage >= 80) return 8.5;
    if (percentage >= 70) return 8.0;
    if (percentage >= 60) return 7.5;
    if (percentage >= 50) return 7.0;
    if (percentage >= 40) return 6.5;
    if (percentage >= 30) return 6.0;
    return 5.5;
}

function calculateReadingScore(answers) {
    const correctAnswers = answers.filter(answer => answer.correct).length;
    const totalQuestions = 3;
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    // Convert percentage to IELTS band score (6.0-9.0)
    if (percentage >= 90) return 9.0;
    if (percentage >= 80) return 8.5;
    if (percentage >= 70) return 8.0;
    if (percentage >= 60) return 7.5;
    if (percentage >= 50) return 7.0;
    if (percentage >= 40) return 6.5;
    if (percentage >= 30) return 6.0;
    return 5.5;
}

function calculateWritingScore(essay) {
    // Basic scoring based on word count and content
    const wordCount = essay.trim().split(/\s+/).length;
    
    if (wordCount < 150) return 5.0;
    if (wordCount < 200) return 5.5;
    if (wordCount < 250) return 6.0;
    if (wordCount < 300) return 6.5;
    if (wordCount < 350) return 7.0;
    if (wordCount < 400) return 7.5;
    return 8.0;
}

function calculateSpeakingScore(recordings) {
    // Basic scoring - in real implementation, this would use speech recognition
    return recordings.length > 0 ? 7.0 : 5.0;
}

function updateWordCount() {
    const essay = document.getElementById('writingEssay').value;
    const wordCount = essay.trim().split(/\s+/).filter(word => word.length > 0).length;
    document.getElementById('wordCount').textContent = wordCount;
}

function updateProgressBar() {
    const steps = ['welcome-step', 'listening-step', 'reading-step', 'writing-step', 'speaking-step', 'results-step'];
    const currentIndex = steps.indexOf(currentStep);
    const progress = (currentIndex / (steps.length - 1)) * 100;
    
    document.getElementById('progressFill').style.width = progress + '%';
}

// Recording functionality
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

function toggleRecording(recordingId) {
    if (!isRecording) {
        startRecording(recordingId);
    } else {
        stopRecording(recordingId);
    }
}

function startRecording(recordingId) {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // Save recording
                assessmentData.speaking.recordings.push({
                    id: recordingId,
                    audioUrl: audioUrl,
                    duration: Date.now() - recordingStartTime
                });
                
                // Update UI
                document.getElementById(`recordBtn${recordingId}`).textContent = '🎤 Recording Complete';
                document.getElementById(`recordBtn${recordingId}`).classList.remove('recording');
                document.getElementById(`recordingStatus${recordingId}`).style.display = 'none';
            };
            
            mediaRecorder.start();
            isRecording = true;
            recordingStartTime = Date.now();
            
            // Update UI
            document.getElementById(`recordBtn${recordingId}`).textContent = '⏹️ Stop Recording';
            document.getElementById(`recordBtn${recordingId}`).classList.add('recording');
            document.getElementById(`recordingStatus${recordingId}`).style.display = 'block';
        })
        .catch(err => {
            console.error('Error accessing microphone:', err);
            alert('Please allow microphone access to record your speaking.');
        });
}

function stopRecording(recordingId) {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        // Stop all tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
}

// OpenAI Integration
async function submitAssessment() {
    // Save final step data
    saveCurrentStepData();
    
    // Show loading
    nextStep('results-step');
    
    try {
        // Get OpenAI API key from user
        const apiKey = await getOpenAIKey();
        if (!apiKey) {
            showResultsWithoutAI();
            return;
        }
        
        OPENAI_CONFIG.apiKey = apiKey;
        
        // Generate AI feedback
        const feedback = await generateAIFeedback();
        
        // Display results
        displayResults(feedback);
        
    } catch (error) {
        console.error('Error generating feedback:', error);
        showResultsWithoutAI();
    }
}

async function getOpenAIKey() {
    return new Promise((resolve) => {
        const apiKey = prompt('Please enter your OpenAI API key to get AI-powered feedback (or click Cancel to skip):');
        resolve(apiKey);
    });
}

async function generateAIFeedback() {
    const overallScore = calculateOverallScore();
    
    const prompt = `You are an expert IELTS examiner. Analyze the following IELTS assessment data and provide detailed feedback:

Overall Score: ${overallScore}
Listening Score: ${assessmentData.listening.score}
Reading Score: ${assessmentData.reading.score}
Writing Score: ${assessmentData.writing.score}
Speaking Score: ${assessmentData.speaking.score}

Writing Essay: "${assessmentData.writing.essay}"

Please provide:
1. Detailed feedback for each module (Listening, Reading, Writing, Speaking)
2. Specific areas for improvement
3. A personalized 4-week study plan
4. Recommended resources and practice materials

Format the response as JSON with the following structure:
{
    "detailedFeedback": {
        "listening": "...",
        "reading": "...", 
        "writing": "...",
        "speaking": "..."
    },
    "studyPlan": {
        "week1": "...",
        "week2": "...",
        "week3": "...",
        "week4": "..."
    },
    "recommendations": "..."
}`;

    const response = await fetch(OPENAI_CONFIG.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: OPENAI_CONFIG.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert IELTS examiner with 10+ years of experience. Provide detailed, actionable feedback.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        })
    });

    if (!response.ok) {
        throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
}

function calculateOverallScore() {
    const scores = [
        assessmentData.listening.score,
        assessmentData.reading.score,
        assessmentData.writing.score,
        assessmentData.speaking.score
    ];
    
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average * 2) / 2; // Round to nearest 0.5
}

function displayResults(feedback) {
    // Hide loading
    document.getElementById('loadingResults').style.display = 'none';
    
    // Show results
    document.getElementById('assessmentResults').style.display = 'block';
    
    // Update scores
    const overallScore = calculateOverallScore();
    document.getElementById('overallScore').textContent = overallScore;
    document.getElementById('listeningScore').textContent = assessmentData.listening.score;
    document.getElementById('readingScore').textContent = assessmentData.reading.score;
    document.getElementById('writingScore').textContent = assessmentData.writing.score;
    document.getElementById('speakingScore').textContent = assessmentData.speaking.score;
    
    // Display AI feedback
    if (feedback && feedback.detailedFeedback) {
        const feedbackHtml = `
            <div class="row">
                <div class="col-md-6">
                    <h5>Listening Feedback</h5>
                    <p>${feedback.detailedFeedback.listening}</p>
                </div>
                <div class="col-md-6">
                    <h5>Reading Feedback</h5>
                    <p>${feedback.detailedFeedback.reading}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <h5>Writing Feedback</h5>
                    <p>${feedback.detailedFeedback.writing}</p>
                </div>
                <div class="col-md-6">
                    <h5>Speaking Feedback</h5>
                    <p>${feedback.detailedFeedback.speaking}</p>
                </div>
            </div>
        `;
        document.getElementById('detailedFeedback').innerHTML = feedbackHtml;
        
        // Display study plan
        if (feedback.studyPlan) {
            const studyPlanHtml = `
                <div class="row">
                    <div class="col-md-6">
                        <h5>Week 1</h5>
                        <p>${feedback.studyPlan.week1}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>Week 2</h5>
                        <p>${feedback.studyPlan.week2}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <h5>Week 3</h5>
                        <p>${feedback.studyPlan.week3}</p>
                    </div>
                    <div class="col-md-6">
                        <h5>Week 4</h5>
                        <p>${feedback.studyPlan.week4}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <h5>Additional Recommendations</h5>
                    <p>${feedback.recommendations}</p>
                </div>
            `;
            document.getElementById('studyPlan').innerHTML = studyPlanHtml;
        }
    }
}

function showResultsWithoutAI() {
    // Hide loading
    document.getElementById('loadingResults').style.display = 'none';
    
    // Show results
    document.getElementById('assessmentResults').style.display = 'block';
    
    // Update scores
    const overallScore = calculateOverallScore();
    document.getElementById('overallScore').textContent = overallScore;
    document.getElementById('listeningScore').textContent = assessmentData.listening.score;
    document.getElementById('readingScore').textContent = assessmentData.reading.score;
    document.getElementById('writingScore').textContent = assessmentData.writing.score;
    document.getElementById('speakingScore').textContent = assessmentData.speaking.score;
    
    // Show basic feedback
    const basicFeedback = `
        <div class="row">
            <div class="col-md-6">
                <h5>Listening Score: ${assessmentData.listening.score}</h5>
                <p>Your listening comprehension skills are at a ${assessmentData.listening.score >= 7 ? 'good' : 'developing'} level. 
                ${assessmentData.listening.score < 7 ? 'Focus on practicing with different accents and speeds.' : 'Continue practicing to maintain your level.'}</p>
            </div>
            <div class="col-md-6">
                <h5>Reading Score: ${assessmentData.reading.score}</h5>
                <p>Your reading skills are at a ${assessmentData.reading.score >= 7 ? 'good' : 'developing'} level.
                ${assessmentData.reading.score < 7 ? 'Practice skimming and scanning techniques.' : 'Continue reading diverse materials.'}</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h5>Writing Score: ${assessmentData.writing.score}</h5>
                <p>Your writing skills are at a ${assessmentData.writing.score >= 7 ? 'good' : 'developing'} level.
                ${assessmentData.writing.score < 7 ? 'Focus on essay structure and vocabulary development.' : 'Continue practicing different essay types.'}</p>
            </div>
            <div class="col-md-6">
                <h5>Speaking Score: ${assessmentData.speaking.score}</h5>
                <p>Your speaking skills are at a ${assessmentData.speaking.score >= 7 ? 'good' : 'developing'} level.
                ${assessmentData.speaking.score < 7 ? 'Practice speaking regularly and work on fluency.' : 'Continue practicing to maintain your level.'}</p>
            </div>
        </div>
    `;
    document.getElementById('detailedFeedback').innerHTML = basicFeedback;
    
    // Show basic study plan
    const basicStudyPlan = `
        <div class="row">
            <div class="col-md-6">
                <h5>Week 1-2: Foundation Building</h5>
                <p>Focus on your weakest areas. Practice daily with IELTS materials.</p>
            </div>
            <div class="col-md-6">
                <h5>Week 3-4: Advanced Practice</h5>
                <p>Take full mock tests and work on time management.</p>
            </div>
        </div>
        <div class="mt-3">
            <h5>Recommended Resources</h5>
            <ul>
                <li>Cambridge IELTS Practice Tests</li>
                <li>Official IELTS Practice Materials</li>
                <li>Online IELTS preparation courses</li>
                <li>Speaking practice with native speakers</li>
            </ul>
        </div>
    `;
    document.getElementById('studyPlan').innerHTML = basicStudyPlan;
}

function downloadResults() {
    const overallScore = calculateOverallScore();
    const results = `
IELTS Assessment Results
=======================

Overall Band Score: ${overallScore}

Individual Scores:
- Listening: ${assessmentData.listening.score}
- Reading: ${assessmentData.reading.score}
- Writing: ${assessmentData.writing.score}
- Speaking: ${assessmentData.speaking.score}

Assessment Date: ${new Date().toLocaleDateString()}

Generated by VisaFluent IELTS Assessment System
    `;
    
    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ielts-assessment-results.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function restartAssessment() {
    // Reset assessment data
    assessmentData = {
        listening: { answers: [], score: 0 },
        reading: { answers: [], score: 0 },
        writing: { essay: '', score: 0 },
        speaking: { recordings: [], score: 0 }
    };
    
    // Reset UI
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('writingEssay').value = '';
    updateWordCount();
    
    // Go back to welcome step
    currentStep = 'welcome-step';
    document.querySelectorAll('.assessment-step').forEach(step => step.classList.remove('active'));
    document.getElementById('welcome-step').classList.add('active');
    updateProgressBar();
}