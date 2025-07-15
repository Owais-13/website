// IELTS Scoring System powered by OpenAI
class IELTSScoring {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.prompts = this.initializePrompts();
    }

    initializePrompts() {
        return {
            writing: {
                task1: `You are an expert IELTS examiner. Evaluate this IELTS Writing Task 1 response according to official IELTS criteria:

Task Achievement (25%):
- Covers requirements of task
- Presents clear overview
- Highlights key features
- Uses data accurately

Coherence and Cohesion (25%):
- Logical organization
- Clear progression
- Appropriate paragraphing
- Effective linking devices

Lexical Resource (25%):
- Range of vocabulary
- Accuracy of word choice
- Spelling accuracy
- Word formation

Grammatical Range and Accuracy (25%):
- Variety of structures
- Grammar accuracy
- Punctuation

Provide:
1. Overall band score (0.5-9.0)
2. Individual criterion scores
3. Detailed feedback for improvement
4. Specific examples from the text

User's response: `,

                task2: `You are an expert IELTS examiner. Evaluate this IELTS Writing Task 2 response according to official IELTS criteria:

Task Response (25%):
- Addresses all parts of task
- Develops position clearly
- Supports ideas with examples
- Reaches conclusion

Coherence and Cohesion (25%):
- Logical organization
- Clear progression
- Appropriate paragraphing
- Effective linking devices

Lexical Resource (25%):
- Range of vocabulary
- Accuracy of word choice
- Spelling accuracy
- Collocation and usage

Grammatical Range and Accuracy (25%):
- Variety of structures
- Grammar accuracy
- Punctuation

Provide:
1. Overall band score (0.5-9.0)
2. Individual criterion scores
3. Detailed feedback for improvement
4. Specific examples from the text

User's response: `
            },
            speaking: `You are an expert IELTS examiner. Evaluate this IELTS Speaking response according to official criteria:

Fluency and Coherence (25%):
- Speech rate and flow
- Logical sequencing
- Appropriate discourse markers

Lexical Resource (25%):
- Range of vocabulary
- Flexibility and precise usage
- Natural and appropriate language

Grammatical Range and Accuracy (25%):
- Range of structures
- Accuracy of grammar
- Appropriate usage

Pronunciation (25%):
- Individual sounds
- Word stress
- Sentence stress and intonation

Based on the transcript provided, give:
1. Overall band score (0.5-9.0)
2. Individual criterion scores
3. Detailed feedback
4. Improvement suggestions

Transcript: `
        };
    }

    async scoreWritingTask1(response, taskDescription) {
        const prompt = `${this.prompts.writing.task1}

Task Description: ${taskDescription}

Response: ${response}`;

        return await this.getOpenAIScore(prompt);
    }

    async scoreWritingTask2(response, taskQuestion) {
        const prompt = `${this.prompts.writing.task2}

Question: ${taskQuestion}

Response: ${response}`;

        return await this.getOpenAIScore(prompt);
    }

    async scoreSpeaking(transcript, taskType, question) {
        const prompt = `${this.prompts.speaking}

Task Type: ${taskType}
Question: ${question}
${transcript}`;

        return await this.getOpenAIScore(prompt);
    }

    async getOpenAIScore(prompt) {
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert IELTS examiner with 10+ years of experience. Provide accurate, constructive feedback following official IELTS band descriptors.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 1500,
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            return this.parseScoreResponse(data.choices[0].message.content);
        } catch (error) {
            console.error('Error getting OpenAI score:', error);
            throw error;
        }
    }

    parseScoreResponse(content) {
        // Extract band score from response
        const bandScoreMatch = content.match(/Overall band score[:\s]+(\d+\.?\d*)/i);
        const overallScore = bandScoreMatch ? parseFloat(bandScoreMatch[1]) : null;

        return {
            overallScore: overallScore,
            detailedFeedback: content,
            timestamp: new Date().toISOString()
        };
    }

    // Reading scoring based on correct answers
    scoreReading(answers, correctAnswers) {
        const totalQuestions = correctAnswers.length;
        let correctCount = 0;

        answers.forEach((answer, index) => {
            if (answer && answer.toLowerCase().trim() === correctAnswers[index].toLowerCase().trim()) {
                correctCount++;
            }
        });

        const bandScore = this.convertToIELTSBand(correctCount, totalQuestions);
        
        return {
            overallScore: bandScore,
            correctAnswers: correctCount,
            totalQuestions: totalQuestions,
            detailedFeedback: `You answered ${correctCount} out of ${totalQuestions} questions correctly. Your IELTS Reading band score is ${bandScore}.`,
            timestamp: new Date().toISOString()
        };
    }

    // Listening scoring based on correct answers
    scoreListening(answers, correctAnswers) {
        const totalQuestions = correctAnswers.length;
        let correctCount = 0;

        answers.forEach((answer, index) => {
            if (answer && answer.toLowerCase().trim() === correctAnswers[index].toLowerCase().trim()) {
                correctCount++;
            }
        });

        const bandScore = this.convertToIELTSBand(correctCount, totalQuestions);
        
        return {
            overallScore: bandScore,
            correctAnswers: correctCount,
            totalQuestions: totalQuestions,
            detailedFeedback: `You answered ${correctCount} out of ${totalQuestions} questions correctly. Your IELTS Listening band score is ${bandScore}.`,
            timestamp: new Date().toISOString()
        };
    }

    convertToIELTSBand(correct, total) {
        const percentage = (correct / total) * 100;
        
        if (percentage >= 89) return 9.0;
        if (percentage >= 82) return 8.5;
        if (percentage >= 75) return 8.0;
        if (percentage >= 68) return 7.5;
        if (percentage >= 60) return 7.0;
        if (percentage >= 53) return 6.5;
        if (percentage >= 45) return 6.0;
        if (percentage >= 37) return 5.5;
        if (percentage >= 30) return 5.0;
        if (percentage >= 23) return 4.5;
        if (percentage >= 16) return 4.0;
        if (percentage >= 10) return 3.5;
        if (percentage >= 6) return 3.0;
        if (percentage >= 3) return 2.5;
        return 2.0;
    }
}

// IELTS Test Interface
class IELTSTestInterface {
    constructor(scoringSystem) {
        this.scoringSystem = scoringSystem;
        this.currentTest = null;
        this.startTime = null;
        this.testData = this.initializeTestData();
    }

    initializeTestData() {
        return {
            writing: {
                task1: {
                    question: "The chart below shows the number of households in the US by their annual income in 2007, 2011 and 2015. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
                    timeLimit: 20,
                    wordLimit: 150
                },
                task2: {
                    question: "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer. What, in your opinion, are the main functions of a university?",
                    timeLimit: 40,
                    wordLimit: 250
                }
            },
            reading: {
                passages: [
                    {
                        title: "The History of Chocolate",
                        text: `Chocolate, one of the world's most beloved foods, has a rich history spanning over 3,000 years. The story begins with the ancient Mesoamerican civilizations, particularly the Maya and later the Aztecs, who first discovered the potential of the cacao bean.

The Maya, who flourished between 300 and 600 CE, were among the first to cultivate cacao trees. They prepared a bitter drink from cacao beans, which they called "xocolatl," meaning "bitter water." This beverage was considered sacred and was often used in religious ceremonies. The Maya believed that cacao was a gift from the gods and that consuming it would provide wisdom and strength.

When the Aztecs later adopted cacao, they elevated its status even further. The emperor Montezuma was said to drink 50 cups of chocolate daily, and cacao beans became so valuable that they were used as currency throughout the Aztec empire. Only the nobility and warriors were allowed to consume this precious drink.

The arrival of Spanish conquistador Hernán Cortés in 1519 marked a turning point in chocolate's history. Initially, the Spanish found the bitter cacao drink unpalatable. However, they soon learned to add sugar and spices, creating a sweeter version that became popular among the Spanish aristocracy. By the 17th century, chocolate had spread throughout Europe, though it remained an expensive luxury accessible only to the wealthy.

The Industrial Revolution of the 19th century transformed chocolate production. In 1828, Dutch chemist Coenraad van Houten invented a machine that could separate cocoa butter from cacao beans, creating cocoa powder. This innovation made chocolate cheaper and more widely available. Later, in 1875, Swiss chocolatier Daniel Peter added powdered milk to chocolate, creating the first milk chocolate.

Today, chocolate is a global industry worth billions of dollars, with millions of people worldwide depending on cacao farming for their livelihoods. From its sacred origins in ancient Mesoamerica to its current status as a everyday treat, chocolate continues to bring pleasure to people around the world.`,
                        questions: [
                            "What did the Maya call their chocolate drink?",
                            "What were cacao beans used for in the Aztec empire besides consumption?",
                            "Who invented the process to separate cocoa butter from cacao beans?",
                            "In what year was milk chocolate first created?",
                            "According to the passage, how many cups of chocolate did Emperor Montezuma drink daily?"
                        ],
                        answers: ["xocolatl", "currency", "coenraad van houten", "1875", "50"]
                    }
                ]
            },
            listening: {
                sections: [
                    {
                        title: "Conversation about course registration",
                        audioUrl: "audio/listening_section1.mp3",
                        questions: [
                            "What is the student's major?",
                            "How many credits is the course?",
                            "When is the deadline for registration?"
                        ],
                        answers: ["psychology", "3", "friday"]
                    }
                ]
            },
            speaking: {
                parts: [
                    {
                        part: 1,
                        topics: ["Work/Study", "Hometown", "Hobbies"],
                        questions: [
                            "What do you do? Do you work or are you a student?",
                            "Tell me about your hometown.",
                            "What do you like to do in your free time?"
                        ]
                    },
                    {
                        part: 2,
                        topic: "Describe a memorable journey you have taken",
                        questions: [
                            "Where did you go?",
                            "Who did you go with?",
                            "What did you do there?",
                            "Why was it memorable?"
                        ],
                        preparationTime: 60,
                        speakingTime: 120
                    },
                    {
                        part: 3,
                        topic: "Travel and Tourism",
                        questions: [
                            "How has tourism changed in your country?",
                            "What are the benefits of international travel?",
                            "Do you think space tourism will become common in the future?"
                        ]
                    }
                ]
            }
        };
    }

    startWritingTest(task) {
        this.currentTest = { type: 'writing', task: task };
        this.startTime = new Date();
        this.displayWritingTest(task);
    }

    startReadingTest() {
        this.currentTest = { type: 'reading' };
        this.startTime = new Date();
        this.displayReadingTest();
    }

    startListeningTest() {
        this.currentTest = { type: 'listening' };
        this.startTime = new Date();
        this.displayListeningTest();
    }

    startSpeakingTest() {
        this.currentTest = { type: 'speaking' };
        this.startTime = new Date();
        this.displaySpeakingTest();
    }

    displayWritingTest(task) {
        const testData = this.testData.writing[task];
        const testContainer = document.getElementById('test-container');
        
        testContainer.innerHTML = `
            <div class="writing-test">
                <div class="test-header">
                    <h3>IELTS Writing ${task === 'task1' ? 'Task 1' : 'Task 2'}</h3>
                    <p><strong>Time allowed:</strong> ${testData.timeLimit} minutes</p>
                    <p><strong>Word limit:</strong> ${testData.wordLimit} words minimum</p>
                </div>
                
                <div class="test-question">
                    <h4>Question:</h4>
                    <p>${testData.question}</p>
                </div>
                
                <div class="test-answer">
                    <label for="writing-response">Your Response:</label>
                    <textarea id="writing-response" 
                              placeholder="Write your response here..." 
                              rows="20" 
                              class="form-control"></textarea>
                    <div class="word-count">
                        <small id="word-counter">Words: 0</small>
                    </div>
                </div>
                
                <div class="test-actions">
                    <button class="btn btn-primary" onclick="ieltsTestInterface.submitWritingTest('${task}')">
                        Submit for Scoring
                    </button>
                    <button class="btn btn-secondary" onclick="ieltsTestInterface.saveProgress()">
                        Save Progress
                    </button>
                </div>
            </div>
        `;

        // Add word counter
        document.getElementById('writing-response').addEventListener('input', this.updateWordCount);
        
        // Start timer
        this.startTimer(testData.timeLimit);
    }

    displayReadingTest() {
        const testContainer = document.getElementById('test-container');
        const passage = this.testData.reading.passages[0]; // Using first passage for demo
        
        testContainer.innerHTML = `
            <div class="reading-test">
                <div class="test-header">
                    <h3>IELTS Reading Test</h3>
                    <p><strong>Time allowed:</strong> 60 minutes</p>
                </div>
                
                <div class="reading-passage">
                    <h4>${passage.title}</h4>
                    <div class="passage-text">
                        ${passage.text}
                    </div>
                </div>
                
                <div class="reading-questions">
                    <h4>Questions:</h4>
                    ${passage.questions.map((question, index) => `
                        <div class="question-item">
                            <p><strong>${index + 1}.</strong> ${question}</p>
                            <input type="text" 
                                   id="reading-answer-${index}" 
                                   class="form-control reading-answer" 
                                   placeholder="Your answer">
                        </div>
                    `).join('')}
                </div>
                
                <div class="test-actions">
                    <button class="btn btn-primary" onclick="ieltsTestInterface.submitReadingTest()">
                        Submit for Scoring
                    </button>
                </div>
            </div>
        `;
        
        this.startTimer(60);
    }

    displayListeningTest() {
        const testContainer = document.getElementById('test-container');
        const section = this.testData.listening.sections[0]; // Using first section for demo
        
        testContainer.innerHTML = `
            <div class="listening-test">
                <div class="test-header">
                    <h3>IELTS Listening Test</h3>
                    <p><strong>Time allowed:</strong> 30 minutes</p>
                </div>
                
                <div class="listening-section">
                    <h4>${section.title}</h4>
                    <div class="audio-player">
                        <audio controls>
                            <source src="${section.audioUrl}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>
                
                <div class="listening-questions">
                    <h4>Questions:</h4>
                    ${section.questions.map((question, index) => `
                        <div class="question-item">
                            <p><strong>${index + 1}.</strong> ${question}</p>
                            <input type="text" 
                                   id="listening-answer-${index}" 
                                   class="form-control listening-answer" 
                                   placeholder="Your answer">
                        </div>
                    `).join('')}
                </div>
                
                <div class="test-actions">
                    <button class="btn btn-primary" onclick="ieltsTestInterface.submitListeningTest()">
                        Submit for Scoring
                    </button>
                </div>
            </div>
        `;
        
        this.startTimer(30);
    }

    displaySpeakingTest() {
        const testContainer = document.getElementById('test-container');
        
        testContainer.innerHTML = `
            <div class="speaking-test">
                <div class="test-header">
                    <h3>IELTS Speaking Test</h3>
                    <p><strong>Total time:</strong> 11-14 minutes</p>
                </div>
                
                <div class="speaking-instructions">
                    <p>This test simulates the IELTS Speaking test. You can record your responses or type them for evaluation.</p>
                </div>
                
                <div class="speaking-parts">
                    ${this.testData.speaking.parts.map((part, index) => `
                        <div class="speaking-part" id="speaking-part-${part.part}">
                            <h4>Part ${part.part}</h4>
                            ${part.part === 2 ? `<p><strong>Topic:</strong> ${part.topic}</p>` : ''}
                            ${part.preparationTime ? `<p><strong>Preparation time:</strong> ${part.preparationTime} seconds</p>` : ''}
                            ${part.speakingTime ? `<p><strong>Speaking time:</strong> ${part.speakingTime} seconds</p>` : ''}
                            
                            <div class="questions">
                                ${part.questions.map((question, qIndex) => `
                                    <div class="question-item">
                                        <p><strong>Q${qIndex + 1}:</strong> ${question}</p>
                                        <textarea id="speaking-response-${part.part}-${qIndex}" 
                                                  class="form-control speaking-response" 
                                                  rows="4" 
                                                  placeholder="Type your response or use the record button below"></textarea>
                                        <button class="btn btn-sm btn-outline-primary mt-2" 
                                                onclick="ieltsTestInterface.startRecording(${part.part}, ${qIndex})">
                                            🎤 Record Response
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="test-actions">
                    <button class="btn btn-primary" onclick="ieltsTestInterface.submitSpeakingTest()">
                        Submit for Scoring
                    </button>
                </div>
            </div>
        `;
    }

    async submitWritingTest(task) {
        const response = document.getElementById('writing-response').value;
        
        if (!response.trim()) {
            alert('Please provide a response before submitting.');
            return;
        }

        this.showLoading('Evaluating your writing response...');
        
        try {
            let result;
            if (task === 'task1') {
                result = await this.scoringSystem.scoreWritingTask1(response, this.testData.writing.task1.question);
            } else {
                result = await this.scoringSystem.scoreWritingTask2(response, this.testData.writing.task2.question);
            }
            
            this.displayResults(result, 'writing');
        } catch (error) {
            console.error('Error scoring writing test:', error);
            alert('Error occurred while scoring. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    submitReadingTest() {
        const answers = [];
        const passage = this.testData.reading.passages[0];
        
        for (let i = 0; i < passage.questions.length; i++) {
            const answer = document.getElementById(`reading-answer-${i}`).value;
            answers.push(answer);
        }
        
        const result = this.scoringSystem.scoreReading(answers, passage.answers);
        this.displayResults(result, 'reading');
    }

    submitListeningTest() {
        const answers = [];
        const section = this.testData.listening.sections[0];
        
        for (let i = 0; i < section.questions.length; i++) {
            const answer = document.getElementById(`listening-answer-${i}`).value;
            answers.push(answer);
        }
        
        const result = this.scoringSystem.scoreListening(answers, section.answers);
        this.displayResults(result, 'listening');
    }

    async submitSpeakingTest() {
        const responses = [];
        
        this.testData.speaking.parts.forEach(part => {
            part.questions.forEach((question, qIndex) => {
                const response = document.getElementById(`speaking-response-${part.part}-${qIndex}`).value;
                if (response.trim()) {
                    responses.push({
                        part: part.part,
                        question: question,
                        response: response
                    });
                }
            });
        });
        
        if (responses.length === 0) {
            alert('Please provide at least one response before submitting.');
            return;
        }

        this.showLoading('Evaluating your speaking responses...');
        
        try {
            const combinedTranscript = responses.map(r => 
                `Part ${r.part}: ${r.question}\nResponse: ${r.response}`
            ).join('\n\n');
            
            const result = await this.scoringSystem.scoreSpeaking(combinedTranscript, 'Full Speaking Test', 'Complete IELTS Speaking Test');
            this.displayResults(result, 'speaking');
        } catch (error) {
            console.error('Error scoring speaking test:', error);
            alert('Error occurred while scoring. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    displayResults(result, testType) {
        const testContainer = document.getElementById('test-container');
        
        testContainer.innerHTML = `
            <div class="test-results">
                <div class="results-header">
                    <h3>IELTS ${testType.charAt(0).toUpperCase() + testType.slice(1)} Test Results</h3>
                    <div class="score-badge">
                        <span class="score-label">Overall Band Score</span>
                        <span class="score-value">${result.overallScore}</span>
                    </div>
                </div>
                
                ${result.correctAnswers !== undefined ? `
                    <div class="score-breakdown">
                        <p><strong>Correct Answers:</strong> ${result.correctAnswers} / ${result.totalQuestions}</p>
                        <p><strong>Accuracy:</strong> ${Math.round((result.correctAnswers / result.totalQuestions) * 100)}%</p>
                    </div>
                ` : ''}
                
                <div class="detailed-feedback">
                    <h4>Detailed Feedback</h4>
                    <div class="feedback-content">
                        ${result.detailedFeedback.split('\n').map(line => `<p>${line}</p>`).join('')}
                    </div>
                </div>
                
                <div class="test-actions">
                    <button class="btn btn-primary" onclick="ieltsTestInterface.retakeTest()">
                        Take Another Test
                    </button>
                    <button class="btn btn-success" onclick="ieltsTestInterface.saveResults('${testType}', ${JSON.stringify(result).replace(/'/g, "&#39;")})">
                        Save Results
                    </button>
                </div>
            </div>
        `;
    }

    updateWordCount() {
        const text = document.getElementById('writing-response').value;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        document.getElementById('word-counter').textContent = `Words: ${wordCount}`;
    }

    startTimer(minutes) {
        let timeLeft = minutes * 60; // Convert to seconds
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'timer-display';
        timerDisplay.className = 'timer-display';
        document.querySelector('.test-header').appendChild(timerDisplay);
        
        const timer = setInterval(() => {
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            timerDisplay.textContent = `Time remaining: ${mins}:${secs.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert('Time is up!');
            }
            timeLeft--;
        }, 1000);
    }

    showLoading(message) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="loading-content">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }

    hideLoading() {
        const loadingDiv = document.getElementById('loading-overlay');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    startRecording(part, questionIndex) {
        // This would implement actual audio recording functionality
        alert('Audio recording functionality would be implemented here using MediaRecorder API');
    }

    retakeTest() {
        document.getElementById('test-container').innerHTML = `
            <div class="test-selection">
                <h3>Choose Your Test</h3>
                <div class="test-options">
                    <button class="btn btn-primary m-2" onclick="ieltsTestInterface.startWritingTest('task1')">Writing Task 1</button>
                    <button class="btn btn-primary m-2" onclick="ieltsTestInterface.startWritingTest('task2')">Writing Task 2</button>
                    <button class="btn btn-primary m-2" onclick="ieltsTestInterface.startReadingTest()">Reading Test</button>
                    <button class="btn btn-primary m-2" onclick="ieltsTestInterface.startListeningTest()">Listening Test</button>
                    <button class="btn btn-primary m-2" onclick="ieltsTestInterface.startSpeakingTest()">Speaking Test</button>
                </div>
            </div>
        `;
    }

    saveResults(testType, result) {
        const savedResults = JSON.parse(localStorage.getItem('ieltsResults') || '[]');
        savedResults.push({
            testType: testType,
            result: result,
            date: new Date().toISOString()
        });
        localStorage.setItem('ieltsResults', JSON.stringify(savedResults));
        alert('Results saved successfully!');
    }

    saveProgress() {
        const currentResponse = document.getElementById('writing-response').value;
        localStorage.setItem('ieltsProgress', JSON.stringify({
            testType: this.currentTest.type,
            task: this.currentTest.task,
            response: currentResponse,
            timestamp: new Date().toISOString()
        }));
        alert('Progress saved successfully!');
    }
}

// Initialize the system when the page loads
let ieltsScoring;
let ieltsTestInterface;

// This will be called when the user provides their OpenAI API key
function initializeIELTSScoring(apiKey) {
    ieltsScoring = new IELTSScoring(apiKey);
    ieltsTestInterface = new IELTSTestInterface(ieltsScoring);
    console.log('IELTS Scoring system initialized successfully');
}