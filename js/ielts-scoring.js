// IELTS Scoring System using OpenAI API
class IELTSScoring {
    constructor() {
        // Note: In production, the API key should be stored securely on the server
        // This is just for demonstration. Never expose API keys in client-side code
        this.apiEndpoint = '/api/ielts-score'; // Server endpoint to handle OpenAI requests
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Writing test submission
        $(document).on('click', '.submit-writing-test', (e) => {
            e.preventDefault();
            const task1 = $('#writing-task1').val();
            const task2 = $('#writing-task2').val();
            this.scoreWritingTest(task1, task2);
        });

        // Speaking test submission
        $(document).on('click', '.submit-speaking-test', (e) => {
            e.preventDefault();
            const transcript = $('#speaking-transcript').val();
            this.scoreSpeakingTest(transcript);
        });
    }

    async scoreWritingTest(task1, task2) {
        if (!task1 || !task2) {
            this.showAlert('Please complete both writing tasks before submitting.', 'warning');
            return;
        }

        this.showLoading('writing-results');

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'writing',
                    task1: task1,
                    task2: task2
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get scoring');
            }

            const result = await response.json();
            this.displayWritingResults(result);
        } catch (error) {
            console.error('Error scoring writing test:', error);
            this.showAlert('Error scoring your writing test. Please try again.', 'danger');
            this.hideLoading('writing-results');
        }
    }

    async scoreSpeakingTest(transcript) {
        if (!transcript) {
            this.showAlert('Please provide your speaking response before submitting.', 'warning');
            return;
        }

        this.showLoading('speaking-results');

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'speaking',
                    transcript: transcript
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get scoring');
            }

            const result = await response.json();
            this.displaySpeakingResults(result);
        } catch (error) {
            console.error('Error scoring speaking test:', error);
            this.showAlert('Error scoring your speaking test. Please try again.', 'danger');
            this.hideLoading('speaking-results');
        }
    }

    displayWritingResults(result) {
        const resultsHtml = `
            <div class="scoring-results">
                <h3>Your Writing Test Results</h3>
                <div class="score-breakdown">
                    <div class="score-item">
                        <h4>Overall Band Score</h4>
                        <div class="score-circle">${result.overallScore}</div>
                    </div>
                    <div class="score-details">
                        <div class="criteria">
                            <h5>Task Achievement</h5>
                            <div class="progress">
                                <div class="progress-bar" style="width: ${(result.taskAchievement / 9) * 100}%">${result.taskAchievement}</div>
                            </div>
                        </div>
                        <div class="criteria">
                            <h5>Coherence and Cohesion</h5>
                            <div class="progress">
                                <div class="progress-bar" style="width: ${(result.coherenceCohesion / 9) * 100}%">${result.coherenceCohesion}</div>
                            </div>
                        </div>
                        <div class="criteria">
                            <h5>Lexical Resource</h5>
                            <div class="progress">
                                <div class="progress-bar" style="width: ${(result.lexicalResource / 9) * 100}%">${result.lexicalResource}</div>
                            </div>
                        </div>
                        <div class="criteria">
                            <h5>Grammatical Range and Accuracy</h5>
                            <div class="progress">
                                <div class="progress-bar" style="width: ${(result.grammaticalAccuracy / 9) * 100}%">${result.grammaticalAccuracy}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="feedback-section">
                    <h4>Detailed Feedback</h4>
                    <div class="task-feedback">
                        <h5>Task 1 Feedback</h5>
                        <p>${result.task1Feedback}</p>
                    </div>
                    <div class="task-feedback">
                        <h5>Task 2 Feedback</h5>
                        <p>${result.task2Feedback}</p>
                    </div>
                    <div class="improvement-tips">
                        <h5>Areas for Improvement</h5>
                        <ul>
                            ${result.improvements.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        $('#writing-results').html(resultsHtml);
        this.hideLoading('writing-results');
    }

    displaySpeakingResults(result) {
        const resultsHtml = `
            <div class="scoring-results">
                <h3>Your Speaking Test Results</h3>
                <div class="score-breakdown">
                    <div class="score-item">
                        <h4>Overall Band Score</h4>
                        <div class="score-circle">${result.overallScore}</div>
                    </div>
                    <div class="score-details">
                        <div class="criteria">
                            <h5>Fluency and Coherence</h5>
                            <div class="progress">
                                <div class="progress-bar" style="width: ${(result.fluencyCoherence / 9) * 100}%">${result.fluencyCoherence}</div>
                            </div>
                        </div>
                        <div class="criteria">
                            <h5>Lexical Resource</h5>
                            <div class="progress">
                                <div class="progress-bar" style="width: ${(result.lexicalResource / 9) * 100}%">${result.lexicalResource}</div>
                            </div>
                        </div>
                        <div class="criteria">
                            <h5>Grammatical Range and Accuracy</h5>
                            <div class="progress">
                                <div class="progress-bar" style="width: ${(result.grammaticalAccuracy / 9) * 100}%">${result.grammaticalAccuracy}</div>
                            </div>
                        </div>
                        <div class="criteria">
                            <h5>Pronunciation</h5>
                            <div class="progress">
                                <div class="progress-bar" style="width: ${(result.pronunciation / 9) * 100}%">${result.pronunciation}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="feedback-section">
                    <h4>Detailed Feedback</h4>
                    <p>${result.detailedFeedback}</p>
                    <div class="improvement-tips">
                        <h5>Areas for Improvement</h5>
                        <ul>
                            ${result.improvements.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        $('#speaking-results').html(resultsHtml);
        this.hideLoading('speaking-results');
    }

    showLoading(containerId) {
        $(`#${containerId}`).html(`
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Analyzing your responses...</span>
                </div>
                <p class="mt-3">Analyzing your responses with AI...</p>
            </div>
        `);
    }

    hideLoading(containerId) {
        // Loading is replaced with results
    }

    showAlert(message, type) {
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
        $('.alert-container').html(alertHtml);
    }
}

// Initialize IELTS Scoring when document is ready
$(document).ready(function() {
    const ieltsScoring = new IELTSScoring();
});