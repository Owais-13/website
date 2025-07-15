# IELTS AI Scoring System - Setup Guide

## Overview
This system integrates OpenAI's GPT-4 to provide automated IELTS scoring for Writing and Speaking tests. Users can practice IELTS tests and receive instant AI-powered feedback based on official IELTS scoring criteria.

## Features
- **Writing Test (Task 1 & Task 2)**: 
  - Real-time word count tracking
  - Timer with visual warnings
  - AI-powered scoring based on IELTS criteria
  - Detailed feedback for each scoring criterion
  - Suggestions for improvement

- **Speaking Test (Parts 1, 2, & 3)**:
  - Text-based practice interface
  - Part 2 preparation timer
  - Comprehensive scoring for all speaking criteria
  - Individual feedback for each response
  - Average score calculation

## Setup Instructions

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it starts with `sk-`)

### 2. Configure the API Key
1. Open `js/openai-config.js`
2. Replace `YOUR_OPENAI_API_KEY` with your actual API key:
   ```javascript
   apiKey: 'sk-your-actual-api-key-here',
   ```

### 3. Test the Integration
1. Open `writing-test.html` or `speaking-test.html` in your browser
2. Select difficulty level and start a test
3. Complete the test and submit for scoring
4. You should receive AI-generated scores and feedback

## How It Works

### Writing Test Flow
1. User selects Task 1 (150 words) or Task 2 (250 words)
2. User chooses difficulty level (Beginner/Intermediate/Advanced)
3. Timer starts automatically (20 or 40 minutes)
4. User writes their response with real-time word count
5. Upon submission, AI evaluates based on:
   - Task Achievement/Response
   - Coherence and Cohesion
   - Lexical Resource
   - Grammatical Range and Accuracy

### Speaking Test Flow
1. User selects test part (1, 2, or 3)
2. Questions are presented based on selection:
   - Part 1: 5 interview questions
   - Part 2: Cue card with 1-minute preparation
   - Part 3: 5 discussion questions
3. User types responses (simulating verbal answers)
4. AI evaluates based on:
   - Fluency and Coherence
   - Lexical Resource
   - Grammatical Range and Accuracy
   - Pronunciation (estimated from text)

## Scoring System

### Band Scores (0-9)
- Each criterion is scored individually
- Overall band score is calculated using IELTS rounding rules:
  - .25 rounds down to nearest half
  - .75 rounds up to next whole number

### AI Evaluation Process
The system uses GPT-4 to:
1. Analyze user responses against IELTS criteria
2. Provide band scores for each criterion
3. Generate detailed feedback
4. Suggest specific improvements

## Customization Options

### Adding New Questions
Edit the sample questions in the test HTML files:
- Writing: Update `sampleTasks` object in `writing-test.html`
- Speaking: Update `sampleQuestions` object in `speaking-test.html`

### Modifying Scoring Criteria
Adjust weights and descriptions in `js/openai-config.js`:
```javascript
scoringCriteria: {
    writing: {
        taskResponse: { weight: 0.25, description: 'Task Achievement' },
        // ... other criteria
    }
}
```

### Changing AI Model
To use a different OpenAI model, update in `js/openai-config.js`:
```javascript
model: 'gpt-4', // Change to 'gpt-3.5-turbo' for faster, cheaper responses
```

## API Usage and Costs

### Token Usage
- Each test submission uses approximately 1,500-2,000 tokens
- Writing tests typically use more tokens than speaking tests

### Cost Estimation
- GPT-4: ~$0.03-0.06 per test
- GPT-3.5-turbo: ~$0.003-0.006 per test

### Rate Limits
- Default OpenAI rate limits apply
- Consider implementing request throttling for high-volume usage

## Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Ensure API key is correctly set in `js/openai-config.js`
   - Check for typos or extra spaces

2. **"Failed to score the response" error**
   - Verify API key is valid and has credits
   - Check browser console for detailed error messages
   - Ensure internet connection is stable

3. **Slow response times**
   - GPT-4 responses can take 10-20 seconds
   - Consider using GPT-3.5-turbo for faster responses

### Debug Mode
Enable console logging by adding to `js/ielts-scoring.js`:
```javascript
const DEBUG = true;
if (DEBUG) console.log('API Response:', response);
```

## Security Considerations

### API Key Protection
⚠️ **Important**: Never expose your API key in production!

For production deployment:
1. Use a backend server to handle API calls
2. Implement user authentication
3. Store API keys in environment variables
4. Use API request proxying

### Example Backend Implementation
```javascript
// Node.js Express example
app.post('/api/score-writing', authenticate, async (req, res) => {
    const { task, response, taskType } = req.body;
    // Call OpenAI API with server-side key
    const score = await scoreWritingTask(task, response, taskType);
    res.json(score);
});
```

## Future Enhancements

### Planned Features
- Audio recording for speaking tests
- Speech-to-text integration
- Progress tracking and history
- Detailed analytics dashboard
- Practice question generation
- Vocabulary and grammar exercises

### Integration Ideas
- Connect with learning management systems
- Add social features (compare scores)
- Implement spaced repetition for weak areas
- Create mobile app version

## Support and Contribution

For questions or contributions:
- Report issues in the project repository
- Submit pull requests for improvements
- Share feedback for new features

## License and Attribution

This system uses:
- OpenAI GPT-4 for AI scoring
- Bootstrap for UI components
- jQuery for DOM manipulation

Remember to comply with OpenAI's usage policies and IELTS trademark guidelines.