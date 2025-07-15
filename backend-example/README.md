# IELTS AI Scoring Backend

This is a Node.js/Express backend server that securely handles OpenAI API calls for the IELTS AI Scoring System.

## Features

- Secure API key management
- Rate limiting to prevent abuse
- Authentication middleware ready
- RESTful endpoints for scoring
- Error handling and logging
- CORS enabled for frontend integration

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenAI API key.

3. **Run the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and configuration info.

### Score Writing Test
```
POST /api/score/writing
Authorization: Bearer <token>
Content-Type: application/json

{
  "task": "The graph shows...",
  "userResponse": "The provided graph illustrates...",
  "taskType": "task1" // or "task2"
}
```

### Score Speaking Test
```
POST /api/score/speaking
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "Describe your hometown",
  "userResponse": "My hometown is...",
  "part": 1 // 1, 2, or 3
}
```

### Generate Practice Question
```
POST /api/generate/question
Authorization: Bearer <token>
Content-Type: application/json

{
  "testType": "writing_task1", // writing_task1, writing_task2, speaking_part1, etc.
  "difficulty": "intermediate" // beginner, intermediate, advanced
}
```

## Frontend Integration

Update your frontend JavaScript to call the backend instead of OpenAI directly:

```javascript
// Replace direct OpenAI calls with backend API calls
async function scoreWritingTask(task, userResponse, taskType) {
    const response = await fetch('http://localhost:3000/api/score/writing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getUserToken() // Implement this
        },
        body: JSON.stringify({
            task,
            userResponse,
            taskType
        })
    });
    
    const data = await response.json();
    return data.scoring;
}
```

## Security Considerations

1. **Authentication**: Implement proper JWT authentication in the `authenticate` middleware
2. **Rate Limiting**: Adjust rate limits based on your usage
3. **Input Validation**: Add more robust input validation
4. **Error Messages**: Don't expose sensitive info in production
5. **HTTPS**: Always use HTTPS in production

## Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set OPENAI_API_KEY=your_key_here
git push heroku main
```

### Docker
```dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### PM2 (Production)
```bash
npm install -g pm2
pm2 start server.js --name ielts-backend
pm2 save
pm2 startup
```

## Monitoring

Consider adding:
- Logging service (Winston, Morgan)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- API analytics

## Database Integration (Optional)

To store test results:

```javascript
const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
    userId: String,
    testType: String,
    score: Object,
    createdAt: { type: Date, default: Date.now }
});

const TestResult = mongoose.model('TestResult', TestResultSchema);
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request