const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Initialise OpenAI client
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY is not set in environment variables.');
  process.exit(1);
}
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * POST /api/ielts-score
 * Expected body: { text: "<essay text>" }
 * Returns: { band: number, feedback: string }
 */
app.post('/api/ielts-score', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `You are an experienced IELTS Writing Task 2 examiner. According to the official IELTS band descriptors, evaluate the candidate essay below (delimited by triple backticks) and provide:\n1. An overall band score on a scale of 0 to 9, allowing half bands (e.g., 6.5).\n2. Brief feedback (3-6 sentences) explaining the score, mentioning at least Task Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy.\n\nReturn your response strictly in JSON format: {\n  \"band\": <numeric>,\n  \"feedback\": \"<string>\"\n}\n\nEssay:\n\n\`\`\`${text}\`\`\``;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        { role: 'system', content: 'You are ChatGPT.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 400,
      temperature: 0.2,
    });

    // Attempt to parse JSON from OpenAI response
    const assistantMessage = completion.data.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(assistantMessage);
    } catch (e) {
      // If parsing fails, attempt to extract JSON substring
      const match = assistantMessage.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    }

    if (!parsed || typeof parsed.band === 'undefined') {
      return res.status(500).json({ error: 'Failed to parse response from OpenAI', raw: assistantMessage });
    }

    res.json(parsed);
  } catch (err) {
    console.error('Error generating IELTS score:', err.response?.data || err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.send('IELTS AI Scoring API is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});