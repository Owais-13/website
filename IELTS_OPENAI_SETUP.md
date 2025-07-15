# IELTS OpenAI Integration Setup Guide

This guide will help you set up the OpenAI-powered IELTS scoring system for your VisaFluent application.

## Features

- **AI-Powered Writing Assessment**: Automated scoring for IELTS Writing Task 1 and Task 2
- **AI-Powered Speaking Assessment**: Automated scoring for IELTS Speaking test responses
- **Detailed Feedback**: Comprehensive feedback on all IELTS assessment criteria
- **Real-time Results**: Instant scoring and feedback after submission

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- OpenAI API key

## Installation Steps

### 1. Install Dependencies

Run the following command in your project root directory:

```bash
npm install
```

### 2. Set Up Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

### 3. Get an OpenAI API Key

1. Go to [OpenAI's website](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

### 4. Start the Server

Run the development server:

```bash
npm run dev
```

Or for production:

```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## Usage

### Writing Test
1. Navigate to `http://localhost:3000/practice.html`
2. Click on "Writing Mock Test"
3. Complete both Task 1 and Task 2
4. Submit for AI scoring
5. Receive instant feedback and band scores

### Speaking Test
1. Navigate to `http://localhost:3000/practice.html`
2. Click on "Speaking Mock Test"
3. Either:
   - Record your responses using the microphone (requires browser permissions)
   - Or type your responses in the text area
4. Submit for AI scoring
5. Receive instant feedback and band scores

## API Endpoints

### POST /api/ielts-score

Scores IELTS writing or speaking tests.

**Request Body:**

For Writing:
```json
{
  "type": "writing",
  "task1": "Task 1 response text",
  "task2": "Task 2 response text"
}
```

For Speaking:
```json
{
  "type": "speaking",
  "transcript": "Speaking response text"
}
```

**Response:**

Writing Response:
```json
{
  "overallScore": 7.0,
  "taskAchievement": 7.0,
  "coherenceCohesion": 7.0,
  "lexicalResource": 6.5,
  "grammaticalAccuracy": 7.5,
  "task1Feedback": "Detailed feedback for Task 1",
  "task2Feedback": "Detailed feedback for Task 2",
  "improvements": ["Tip 1", "Tip 2", "Tip 3"]
}
```

Speaking Response:
```json
{
  "overallScore": 7.0,
  "fluencyCoherence": 7.0,
  "lexicalResource": 6.5,
  "grammaticalAccuracy": 7.5,
  "pronunciation": 7.0,
  "detailedFeedback": "Comprehensive feedback",
  "improvements": ["Tip 1", "Tip 2", "Tip 3"]
}
```

## File Structure

```
/
├── api/
│   ├── server.js              # Express server setup
│   └── ielts-scoring-api.js   # IELTS scoring endpoints
├── js/
│   └── ielts-scoring.js       # Frontend JavaScript for scoring
├── writing-test.html          # Writing test interface
├── speaking-test.html         # Speaking test interface
├── practice.html              # Practice tests menu
├── package.json               # Node.js dependencies
├── .env.example               # Environment variables template
└── IELTS_OPENAI_SETUP.md     # This file
```

## Security Considerations

1. **Never expose your OpenAI API key in client-side code**
2. The API key should only be used on the server-side
3. Consider implementing rate limiting to prevent abuse
4. Add user authentication for production use
5. Monitor API usage to control costs

## Cost Management

- OpenAI charges per API request based on token usage
- GPT-4 is more expensive but provides better scoring accuracy
- Consider using GPT-3.5-turbo for development/testing
- Implement caching for repeated requests
- Set up usage alerts in your OpenAI dashboard

## Customization

### Modifying Scoring Criteria

Edit the prompts in `api/ielts-scoring-api.js` to adjust:
- Scoring strictness
- Feedback detail level
- Specific IELTS band descriptors

### Adding More Test Types

1. Create new HTML pages for additional test types
2. Add corresponding scoring functions in the API
3. Update the frontend JavaScript to handle new test types

## Troubleshooting

### Common Issues

1. **"Failed to get scoring" error**
   - Check if your OpenAI API key is correctly set
   - Verify internet connection
   - Check OpenAI API status

2. **Server won't start**
   - Ensure all dependencies are installed
   - Check if port 3000 is available
   - Verify Node.js version compatibility

3. **Scoring seems inaccurate**
   - Review and refine the prompts in the API
   - Consider using GPT-4 for better accuracy
   - Provide more context in the system prompts

## Support

For issues or questions:
- Check the OpenAI documentation
- Review the Express.js documentation
- Contact support@ieltsmaster.com

## Future Enhancements

- Real audio recording and transcription for speaking tests
- Integration with speech-to-text for speaking assessment
- Progress tracking and historical scores
- Personalized learning recommendations
- Mobile app development