// IELTS Scoring Engine with OpenAI Integration

class IELTSScoring {
    constructor() {
        this.currentTest = null;
        this.userResponses = {};
        this.scores = {};
    }

    // Call OpenAI API for scoring
    async callOpenAI(prompt) {
        if (!initializeOpenAI()) {
            throw new Error('OpenAI API key not configured');
        }

        try {
            const response = await fetch(OPENAI_CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`
                },
                body: JSON.stringify({
                    model: OPENAI_CONFIG.model,
                    messages: [{
                        role: 'system',
                        content: 'You are an expert IELTS examiner with years of experience in evaluating IELTS tests. Provide accurate band scores based on official IELTS criteria.'
                    }, {
                        role: 'user',
                        content: prompt
                    }],
                    temperature: 0.3,
                    max_tokens: 1500
                })
            });

            if (!response.ok) {
                throw new Error(`API call failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }

    // Score Writing Task
    async scoreWritingTask(task, userResponse, taskType = 'task1') {
        const prompt = `
Please evaluate this IELTS Writing ${taskType === 'task1' ? 'Task 1' : 'Task 2'} response:

Task: ${task}

User Response:
${userResponse}

Please provide:
1. Band score for Task Achievement/Response (0-9)
2. Band score for Coherence and Cohesion (0-9)
3. Band score for Lexical Resource (0-9)
4. Band score for Grammatical Range and Accuracy (0-9)
5. Overall band score
6. Detailed feedback for each criterion
7. Specific suggestions for improvement

Format your response as JSON:
{
    "taskResponse": {"score": X, "feedback": "..."},
    "coherenceCohesion": {"score": X, "feedback": "..."},
    "lexicalResource": {"score": X, "feedback": "..."},
    "grammaticalRange": {"score": X, "feedback": "..."},
    "overallScore": X,
    "generalFeedback": "...",
    "improvements": ["suggestion1", "suggestion2", ...]
}`;

        try {
            const response = await this.callOpenAI(prompt);
            return JSON.parse(response);
        } catch (error) {
            console.error('Error parsing scoring response:', error);
            // Return a default structure if parsing fails
            return {
                error: true,
                message: 'Failed to score the response. Please try again.'
            };
        }
    }

    // Score Speaking Response (for text-based practice)
    async scoreSpeakingResponse(task, userResponse, part = 1) {
        const prompt = `
Please evaluate this IELTS Speaking Part ${part} response:

Task/Question: ${task}

User Response:
${userResponse}

Please provide:
1. Band score for Fluency and Coherence (0-9)
2. Band score for Lexical Resource (0-9)
3. Band score for Grammatical Range and Accuracy (0-9)
4. Band score for Pronunciation (estimated based on text) (0-9)
5. Overall band score
6. Detailed feedback for each criterion
7. Specific suggestions for improvement

Format your response as JSON:
{
    "fluencyCoherence": {"score": X, "feedback": "..."},
    "lexicalResource": {"score": X, "feedback": "..."},
    "grammaticalRange": {"score": X, "feedback": "..."},
    "pronunciation": {"score": X, "feedback": "...", "note": "Based on text analysis"},
    "overallScore": X,
    "generalFeedback": "...",
    "improvements": ["suggestion1", "suggestion2", ...]
}`;

        try {
            const response = await this.callOpenAI(prompt);
            return JSON.parse(response);
        } catch (error) {
            console.error('Error parsing scoring response:', error);
            return {
                error: true,
                message: 'Failed to score the response. Please try again.'
            };
        }
    }

    // Generate practice questions
    async generatePracticeQuestion(testType, difficulty = 'intermediate') {
        const prompts = {
            writing_task1: `Generate an IELTS Academic Writing Task 1 question at ${difficulty} level. Include a description of a graph, chart, table, or diagram that the candidate needs to describe. Format as JSON: {"task": "...", "instructions": "...", "wordLimit": 150}`,
            writing_task2: `Generate an IELTS Writing Task 2 question at ${difficulty} level. Provide an essay topic that requires the candidate to discuss, argue, or present solutions. Format as JSON: {"task": "...", "instructions": "...", "wordLimit": 250}`,
            speaking_part1: `Generate 5 IELTS Speaking Part 1 questions at ${difficulty} level about familiar topics. Format as JSON: {"topic": "...", "questions": ["q1", "q2", "q3", "q4", "q5"]}`,
            speaking_part2: `Generate an IELTS Speaking Part 2 cue card at ${difficulty} level. Format as JSON: {"topic": "...", "task": "...", "points": ["point1", "point2", "point3", "point4"], "followUp": "..."}`,
            speaking_part3: `Generate 5 IELTS Speaking Part 3 questions at ${difficulty} level related to a broader topic. Format as JSON: {"topic": "...", "questions": ["q1", "q2", "q3", "q4", "q5"]}`
        };

        try {
            const response = await this.callOpenAI(prompts[testType]);
            return JSON.parse(response);
        } catch (error) {
            console.error('Error generating practice question:', error);
            return null;
        }
    }

    // Calculate overall band score
    calculateOverallBand(scores) {
        const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
        const average = total / Object.keys(scores).length;
        
        // IELTS rounding rules
        const decimal = average % 1;
        if (decimal < 0.25) return Math.floor(average);
        if (decimal < 0.75) return Math.floor(average) + 0.5;
        return Math.ceil(average);
    }

    // Format score display
    formatScoreDisplay(scoreData) {
        if (scoreData.error) {
            return `<div class="alert alert-danger">${scoreData.message}</div>`;
        }

        let html = '<div class="score-results">';
        html += `<h3 class="mb-4">Your IELTS Score: <span class="badge badge-primary">${scoreData.overallScore}</span></h3>`;
        
        html += '<div class="score-breakdown mb-4">';
        for (const [criterion, data] of Object.entries(scoreData)) {
            if (criterion !== 'overallScore' && criterion !== 'generalFeedback' && criterion !== 'improvements') {
                html += `
                    <div class="criterion-score mb-3">
                        <h5>${this.formatCriterionName(criterion)}: <span class="badge badge-secondary">${data.score}</span></h5>
                        <p class="feedback">${data.feedback}</p>
                    </div>
                `;
            }
        }
        html += '</div>';

        if (scoreData.generalFeedback) {
            html += `
                <div class="general-feedback mb-4">
                    <h5>General Feedback</h5>
                    <p>${scoreData.generalFeedback}</p>
                </div>
            `;
        }

        if (scoreData.improvements && scoreData.improvements.length > 0) {
            html += `
                <div class="improvements">
                    <h5>Suggestions for Improvement</h5>
                    <ul>
                        ${scoreData.improvements.map(imp => `<li>${imp}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    formatCriterionName(criterion) {
        const names = {
            taskResponse: 'Task Achievement/Response',
            coherenceCohesion: 'Coherence and Cohesion',
            lexicalResource: 'Lexical Resource',
            grammaticalRange: 'Grammatical Range and Accuracy',
            fluencyCoherence: 'Fluency and Coherence',
            pronunciation: 'Pronunciation'
        };
        return names[criterion] || criterion;
    }
}

// Initialize global instance
const ieltsScoring = new IELTSScoring();