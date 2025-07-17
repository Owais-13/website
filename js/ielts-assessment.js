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
    setupAudioEventListeners();
    
    // Load saved API key if available
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
        OPENAI_CONFIG.apiKey = savedApiKey;
    }
});

function setupAudioEventListeners() {
    const audioElement = document.getElementById('listeningAudio');
    const audioStatus = document.getElementById('audioStatus');
    const loadingText = document.getElementById('audioLoadingText');
    const errorText = document.getElementById('audioErrorText');
    const readyText = document.getElementById('audioReadyText');
    
    if (audioElement) {
        audioElement.addEventListener('loadstart', function() {
            if (audioStatus) {
                audioStatus.style.display = 'block';
                loadingText.style.display = 'inline';
                errorText.style.display = 'none';
                readyText.style.display = 'none';
            }
        });
        
        audioElement.addEventListener('loadedmetadata', function() {
            if (audioStatus && readyText) {
                loadingText.style.display = 'none';
                errorText.style.display = 'none';
                readyText.style.display = 'inline';
                
                // Hide status after 3 seconds
                setTimeout(() => {
                    audioStatus.style.display = 'none';
                }, 3000);
            }
        });
        
        audioElement.addEventListener('error', function() {
            if (audioStatus && errorText) {
                loadingText.style.display = 'none';
                readyText.style.display = 'none';
                errorText.style.display = 'inline';
            }
        });
        
        // Auto-load the first audio
        if (audioElement.src) {
            audioElement.load();
        }
    }
}

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
    
    // Collect multiple choice answers
    document.querySelectorAll('#listeningQuestions .option-btn.selected').forEach(btn => {
        answers.push({
            questionNumber: btn.getAttribute('data-question'),
            question: btn.closest('.question').querySelector('h5').textContent,
            answer: btn.textContent,
            correct: btn.getAttribute('data-correct') === 'true',
            type: 'multiple_choice'
        });
    });
    
    // Collect text input answers
    document.querySelectorAll('#listeningQuestions input[type="text"]').forEach(input => {
        const userAnswer = input.value.trim();
        const correctAnswer = input.getAttribute('data-correct');
        answers.push({
            questionNumber: input.getAttribute('data-question'),
            question: input.closest('.question').querySelector('h5').textContent,
            answer: userAnswer,
            correctAnswer: correctAnswer,
            correct: userAnswer.toLowerCase().replace(/\s/g, '') === correctAnswer.toLowerCase().replace(/\s/g, ''),
            type: 'completion'
        });
    });
    
    // Collect checkbox answers
    const checkboxGroups = {};
    document.querySelectorAll('#listeningQuestions input[type="checkbox"]').forEach(checkbox => {
        const questionNum = checkbox.getAttribute('data-question');
        if (!checkboxGroups[questionNum]) {
            checkboxGroups[questionNum] = {
                questionNumber: questionNum,
                question: checkbox.closest('.question').querySelector('h5').textContent,
                answers: [],
                type: 'multiple_selection'
            };
        }
        
        checkboxGroups[questionNum].answers.push({
            option: checkbox.nextSibling.textContent.trim(),
            selected: checkbox.checked,
            correct: checkbox.getAttribute('data-correct') === 'true'
        });
    });
    
    // Add checkbox groups to answers
    Object.values(checkboxGroups).forEach(group => {
        group.correct = group.answers.every(answer => 
            answer.selected === answer.correct
        );
        answers.push(group);
    });
    
    assessmentData.listening.answers = answers;
    assessmentData.listening.score = calculateListeningScore(answers);
    assessmentData.listening.detailedAnalysis = generateListeningAnalysis(answers);
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
    const totalQuestions = answers.length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    // IELTS band score conversion
    if (percentage >= 90) return 9.0;
    if (percentage >= 80) return 8.0;
    if (percentage >= 70) return 7.0;
    if (percentage >= 60) return 6.5;
    if (percentage >= 50) return 6.0;
    if (percentage >= 40) return 5.5;
    if (percentage >= 30) return 5.0;
    return 4.5;
}

// Audio control functions
function playAudio(section) {
    const audioElement = document.getElementById('listeningAudio');
    const titleElement = document.getElementById('currentAudioTitle');
    const durationElement = document.getElementById('audioDuration');
    
    // Update button states
    document.querySelectorAll('.audio-controls .btn').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-secondary');
    });
    
    const audioSources = {
        'section1': {
            src: 'audio/listening/beginner/test1_section1.wav',
            title: 'Gym Membership Conversation',
            duration: '~2 minutes'
        }
    };
    
    if (audioSources[section]) {
        // Update audio source
        audioElement.src = audioSources[section].src;
        titleElement.textContent = audioSources[section].title;
        durationElement.textContent = audioSources[section].duration;
        
        // Update active button
        event.target.classList.remove('btn-outline-secondary');
        event.target.classList.add('btn-primary');
        
        // Show loading status
        const audioStatus = document.getElementById('audioStatus');
        const loadingText = document.getElementById('audioLoadingText');
        const errorText = document.getElementById('audioErrorText');
        const readyText = document.getElementById('audioReadyText');
        
        if (audioStatus) {
            audioStatus.style.display = 'block';
            loadingText.style.display = 'inline';
            errorText.style.display = 'none';
            readyText.style.display = 'none';
        }
        
        // Load and play audio
        audioElement.load();
        
        audioElement.addEventListener('loadeddata', function() {
            audioElement.play().catch(e => {
                console.log('Audio autoplay prevented:', e);
                // Show manual play instruction
                if (audioStatus) {
                    loadingText.style.display = 'none';
                    readyText.innerHTML = '▶️ Click play button to start audio';
                    readyText.style.display = 'inline';
                }
            });
        }, { once: true });
    }
}

// Generate detailed listening analysis
function generateListeningAnalysis(answers) {
    const analysis = {
        totalQuestions: answers.length,
        correctAnswers: answers.filter(a => a.correct).length,
        questionTypes: {},
        strengths: [],
        weaknesses: [],
        recommendations: []
    };
    
    // Analyze by question type
    answers.forEach(answer => {
        if (!analysis.questionTypes[answer.type]) {
            analysis.questionTypes[answer.type] = { total: 0, correct: 0 };
        }
        analysis.questionTypes[answer.type].total++;
        if (answer.correct) {
            analysis.questionTypes[answer.type].correct++;
        }
    });
    
    // Generate insights
    Object.entries(analysis.questionTypes).forEach(([type, stats]) => {
        const accuracy = (stats.correct / stats.total) * 100;
        if (accuracy >= 75) {
            analysis.strengths.push(`Strong performance in ${type.replace('_', ' ')} questions (${accuracy.toFixed(0)}% accuracy)`);
        } else if (accuracy < 50) {
            analysis.weaknesses.push(`Needs improvement in ${type.replace('_', ' ')} questions (${accuracy.toFixed(0)}% accuracy)`);
        }
    });
    
    // Generate recommendations
    if (analysis.weaknesses.length > 0) {
        analysis.recommendations.push("Practice more listening exercises with diverse accents");
        analysis.recommendations.push("Focus on note-taking while listening");
        analysis.recommendations.push("Improve vocabulary for specific contexts");
    }
    
    return analysis;
}

// AI-powered listening analysis
async function analyzeListeningWithAI() {
    // Save current data first
    saveListeningData();
    
    const analysisButton = event.target;
    const originalText = analysisButton.innerHTML;
    
    // Show loading state
    analysisButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing with AI...';
    analysisButton.disabled = true;
    
    try {
        // Prepare data for AI analysis
        const listeningData = assessmentData.listening;
        const prompt = generateAIAnalysisPrompt(listeningData);
        
        // Check if API key is available
        if (!OPENAI_CONFIG.apiKey) {
            // Show API key input modal
            showAPIKeyModal();
            return;
        }
        
        // Make API call to OpenAI
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
                        content: 'You are an expert IELTS assessor specializing in listening skills. Provide detailed, constructive feedback on student performance.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        const aiAnalysis = data.choices[0].message.content;
        
        // Display AI analysis
        displayAIAnalysis(aiAnalysis, listeningData);
        
    } catch (error) {
        console.error('AI Analysis Error:', error);
        // Fallback to local analysis
        displayLocalAnalysis(assessmentData.listening);
    } finally {
        // Restore button state
        analysisButton.innerHTML = originalText;
        analysisButton.disabled = false;
    }
}

function generateAIAnalysisPrompt(listeningData) {
    return `
Please analyze this IELTS Listening assessment performance:

Score: ${listeningData.score}/9.0
Correct Answers: ${listeningData.detailedAnalysis.correctAnswers}/${listeningData.detailedAnalysis.totalQuestions}

Question Performance:
${listeningData.answers.map((answer, index) => {
    return `${index + 1}. ${answer.question}
   Student Answer: ${answer.answer || 'No answer'}
   Correct: ${answer.correct ? 'Yes' : 'No'}
   Type: ${answer.type}`;
}).join('\n')}

Audio Context: Gym membership conversation involving names, numbers, and specific details.

Please provide:
1. Overall band score assessment (4.5-9.0)
2. Specific strengths shown
3. Areas needing improvement
4. 3 targeted recommendations for improvement
5. Prediction for actual IELTS Listening performance

Keep response under 400 words, practical and encouraging.
    `.trim();
}

function displayAIAnalysis(aiAnalysis, listeningData) {
    const analysisModal = `
        <div class="modal fade" id="aiAnalysisModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-robot"></i> AI Listening Analysis
                        </h5>
                        <button type="button" class="close text-white" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="score-display text-center p-3 bg-light rounded">
                                    <h3 class="text-primary">${listeningData.score}</h3>
                                    <p class="mb-0">Estimated Band Score</p>
                                </div>
                                <div class="mt-3">
                                    <small class="text-muted">
                                        Correct: ${listeningData.detailedAnalysis.correctAnswers}/${listeningData.detailedAnalysis.totalQuestions}
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="ai-feedback">
                                    <h6>AI Expert Analysis:</h6>
                                    <div class="analysis-content" style="white-space: pre-line; line-height: 1.6;">
                                        ${aiAnalysis}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <h6>Detailed Performance:</h6>
                            <div class="performance-breakdown">
                                ${Object.entries(listeningData.detailedAnalysis.questionTypes).map(([type, stats]) => {
                                    const accuracy = (stats.correct / stats.total) * 100;
                                    return `
                                        <div class="progress-item mb-2">
                                            <div class="d-flex justify-content-between">
                                                <span>${type.replace('_', ' ').toUpperCase()}</span>
                                                <span>${stats.correct}/${stats.total} (${accuracy.toFixed(0)}%)</span>
                                            </div>
                                            <div class="progress">
                                                <div class="progress-bar ${accuracy >= 75 ? 'bg-success' : accuracy >= 50 ? 'bg-warning' : 'bg-danger'}" 
                                                     style="width: ${accuracy}%"></div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="nextStep('reading-step')" data-dismiss="modal">
                            Continue to Reading
                        </button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            Review Answers
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove any existing modal
    const existingModal = document.getElementById('aiAnalysisModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add and show modal
    document.body.insertAdjacentHTML('beforeend', analysisModal);
    $('#aiAnalysisModal').modal('show');
}

function displayLocalAnalysis(listeningData) {
    const analysis = listeningData.detailedAnalysis;
    const feedback = generateLocalFeedback(analysis);
    displayAIAnalysis(feedback, listeningData);
}

function generateLocalFeedback(analysis) {
    const accuracy = (analysis.correctAnswers / analysis.totalQuestions) * 100;
    
    let feedback = `IELTS Listening Assessment Analysis\n\n`;
    feedback += `Overall Performance: ${accuracy.toFixed(0)}% accuracy\n`;
    feedback += `Estimated Band Score: ${calculateListeningScore(assessmentData.listening.answers)}\n\n`;
    
    if (analysis.strengths.length > 0) {
        feedback += `Strengths:\n${analysis.strengths.map(s => `• ${s}`).join('\n')}\n\n`;
    }
    
    if (analysis.weaknesses.length > 0) {
        feedback += `Areas for Improvement:\n${analysis.weaknesses.map(w => `• ${w}`).join('\n')}\n\n`;
    }
    
    feedback += `Recommendations:\n`;
    feedback += `• Practice with more diverse listening materials\n`;
    feedback += `• Focus on note-taking techniques\n`;
    feedback += `• Work on recognizing key information quickly\n`;
    feedback += `• Practice with different English accents\n\n`;
    
    feedback += `With consistent practice, you can improve your listening score significantly!`;
    
    return feedback;
}

function showAPIKeyModal() {
    const apiKeyModal = `
        <div class="modal fade" id="apiKeyModal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">AI Analysis Setup</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>To enable AI-powered analysis, please enter your OpenAI API key:</p>
                        <div class="form-group">
                            <label>OpenAI API Key:</label>
                            <input type="password" class="form-control" id="openaiApiKey" 
                                   placeholder="sk-...">
                            <small class="text-muted">Your key is stored locally and never shared.</small>
                        </div>
                        <div class="alert alert-info">
                            <strong>Don't have an API key?</strong><br>
                            Visit <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a> to get one.
                            <br><br>
                            <strong>Note:</strong> You can still use the assessment without AI analysis.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="saveAPIKey()">
                            Save & Analyze
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="useLocalAnalysis()">
                            Use Local Analysis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', apiKeyModal);
    $('#apiKeyModal').modal('show');
}

function saveAPIKey() {
    const apiKey = document.getElementById('openaiApiKey').value;
    if (apiKey) {
        OPENAI_CONFIG.apiKey = apiKey;
        localStorage.setItem('openai_api_key', apiKey);
        $('#apiKeyModal').modal('hide');
        analyzeListeningWithAI();
    } else {
        alert('Please enter a valid API key');
    }
}

function useLocalAnalysis() {
    $('#apiKeyModal').modal('hide');
    displayLocalAnalysis(assessmentData.listening);
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
    // Simple scoring based on word count and basic criteria
    const wordCount = essay.split(' ').filter(word => word.length > 0).length;
    
    if (wordCount < 150) return 5.0;
    if (wordCount < 200) return 5.5;
    if (wordCount < 250) return 6.0;
    if (wordCount < 300) return 6.5;
    return 7.0;
}

function calculateSpeakingScore(recordings) {
    // Simple scoring based on number of recordings
    if (recordings.length === 0) return 5.0;
    if (recordings.length === 1) return 6.0;
    if (recordings.length === 2) return 7.0;
    return 8.0;
}

function updateWordCount() {
    const essay = document.getElementById('writingEssay').value;
    const wordCount = essay.split(' ').filter(word => word.length > 0).length;
    document.getElementById('wordCount').textContent = wordCount;
}

function updateProgressBar() {
    // Progress bar logic
    const steps = ['welcome-step', 'listening-step', 'reading-step', 'writing-step', 'speaking-step', 'results-step'];
    const currentIndex = steps.indexOf(currentStep);
    const progress = (currentIndex / (steps.length - 1)) * 100;
    
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

function generateResults() {
    const totalScore = (
        assessmentData.listening.score +
        assessmentData.reading.score +
        assessmentData.writing.score +
        assessmentData.speaking.score
    ) / 4;

    const resultsHTML = `
        <div class="results-summary">
            <h3>Your IELTS Assessment Results</h3>
            <div class="overall-score">
                <h2>Overall Band Score: ${totalScore.toFixed(1)}</h2>
            </div>
            
            <div class="module-scores">
                <div class="score-item">
                    <span>Listening:</span>
                    <span>${assessmentData.listening.score}</span>
                </div>
                <div class="score-item">
                    <span>Reading:</span>
                    <span>${assessmentData.reading.score}</span>
                </div>
                <div class="score-item">
                    <span>Writing:</span>
                    <span>${assessmentData.writing.score}</span>
                </div>
                <div class="score-item">
                    <span>Speaking:</span>
                    <span>${assessmentData.speaking.score}</span>
                </div>
            </div>
            
            <div class="recommendations">
                <h4>Recommendations:</h4>
                <ul>
                    ${totalScore < 6.5 ? '<li>Consider enrolling in our comprehensive IELTS course</li>' : ''}
                    ${assessmentData.listening.score < 7.0 ? '<li>Focus on improving listening skills</li>' : ''}
                    ${assessmentData.reading.score < 7.0 ? '<li>Practice reading comprehension</li>' : ''}
                    ${assessmentData.writing.score < 7.0 ? '<li>Work on writing structure and vocabulary</li>' : ''}
                    ${assessmentData.speaking.score < 7.0 ? '<li>Practice speaking fluency and pronunciation</li>' : ''}
                </ul>
            </div>
        </div>
    `;

    document.getElementById('resultsDisplay').innerHTML = resultsHTML;
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