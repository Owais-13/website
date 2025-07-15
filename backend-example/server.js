// Example Node.js/Express backend for IELTS AI Scoring
// This demonstrates how to securely handle OpenAI API calls server-side

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting to prevent API abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10 // limit each IP to 10 requests per windowMs
});

app.use('/api/score', limiter);

// OpenAI configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Middleware to check authentication (implement your auth logic)
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    // TODO: Implement your authentication logic
    // For example, verify JWT token
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Simulate user authentication
    req.user = { id: 'user123', email: 'user@example.com' };
    next();
};

// Score Writing endpoint
app.post('/api/score/writing', authenticate, async (req, res) => {
    try {
        const { task, userResponse, taskType } = req.body;
        
        // Validate input
        if (!task || !userResponse || !taskType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Prepare the prompt
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

        // Call OpenAI API
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
                        content: 'You are an expert IELTS examiner with years of experience in evaluating IELTS tests. Provide accurate band scores based on official IELTS criteria.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 1500
            })
        });
        
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        const scoringResult = JSON.parse(data.choices[0].message.content);
        
        // Log for analytics (optional)
        console.log(`User ${req.user.id} scored ${scoringResult.overallScore} on ${taskType}`);
        
        // Store in database (optional)
        // await saveTestResult(req.user.id, taskType, scoringResult);
        
        res.json({
            success: true,
            scoring: scoringResult
        });
        
    } catch (error) {
        console.error('Error scoring writing:', error);
        res.status(500).json({ 
            error: 'Failed to score response',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Score Speaking endpoint
app.post('/api/score/speaking', authenticate, async (req, res) => {
    try {
        const { question, userResponse, part } = req.body;
        
        // Validate input
        if (!question || !userResponse || !part) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Prepare the prompt
        const prompt = `
Please evaluate this IELTS Speaking Part ${part} response:

Task/Question: ${question}

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

        // Call OpenAI API
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
                        content: 'You are an expert IELTS examiner with years of experience in evaluating IELTS tests. Provide accurate band scores based on official IELTS criteria.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 1500
            })
        });
        
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        const scoringResult = JSON.parse(data.choices[0].message.content);
        
        res.json({
            success: true,
            scoring: scoringResult
        });
        
    } catch (error) {
        console.error('Error scoring speaking:', error);
        res.status(500).json({ 
            error: 'Failed to score response',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Generate practice questions endpoint
app.post('/api/generate/question', authenticate, async (req, res) => {
    try {
        const { testType, difficulty } = req.body;
        
        const prompts = {
            writing_task1: `Generate an IELTS Academic Writing Task 1 question at ${difficulty} level. Include a description of a graph, chart, table, or diagram that the candidate needs to describe. Format as JSON: {"task": "...", "instructions": "...", "wordLimit": 150}`,
            writing_task2: `Generate an IELTS Writing Task 2 question at ${difficulty} level. Provide an essay topic that requires the candidate to discuss, argue, or present solutions. Format as JSON: {"task": "...", "instructions": "...", "wordLimit": 250}`,
            speaking_part1: `Generate 5 IELTS Speaking Part 1 questions at ${difficulty} level about familiar topics. Format as JSON: {"topic": "...", "questions": ["q1", "q2", "q3", "q4", "q5"]}`,
            speaking_part2: `Generate an IELTS Speaking Part 2 cue card at ${difficulty} level. Format as JSON: {"topic": "...", "task": "...", "points": ["point1", "point2", "point3", "point4"], "followUp": "..."}`,
            speaking_part3: `Generate 5 IELTS Speaking Part 3 questions at ${difficulty} level related to a broader topic. Format as JSON: {"topic": "...", "questions": ["q1", "q2", "q3", "q4", "q5"]}`
        };
        
        if (!prompts[testType]) {
            return res.status(400).json({ error: 'Invalid test type' });
        }
        
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
                        role: 'user',
                        content: prompts[testType]
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });
        
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        const question = JSON.parse(data.choices[0].message.content);
        
        res.json({
            success: true,
            question: question
        });
        
    } catch (error) {
        console.error('Error generating question:', error);
        res.status(500).json({ 
            error: 'Failed to generate question',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        apiKeyConfigured: !!OPENAI_API_KEY
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`IELTS AI Scoring Backend running on port ${PORT}`);
    console.log(`OpenAI API Key configured: ${!!OPENAI_API_KEY}`);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});