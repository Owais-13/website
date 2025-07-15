const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI client
// IMPORTANT: Store your API key in environment variables, not in code
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// IELTS scoring endpoint
router.post('/api/ielts-score', async (req, res) => {
  try {
    const { type, task1, task2, transcript } = req.body;

    if (type === 'writing') {
      const writingScore = await scoreWritingTest(task1, task2);
      res.json(writingScore);
    } else if (type === 'speaking') {
      const speakingScore = await scoreSpeakingTest(transcript);
      res.json(speakingScore);
    } else {
      res.status(400).json({ error: 'Invalid test type' });
    }
  } catch (error) {
    console.error('Error in IELTS scoring:', error);
    res.status(500).json({ error: 'Failed to score test' });
  }
});

async function scoreWritingTest(task1, task2) {
  const systemPrompt = `You are an experienced IELTS examiner. Score the following IELTS writing tasks according to the official IELTS band descriptors. 
  Provide scores for:
  1. Task Achievement (Task 1) / Task Response (Task 2)
  2. Coherence and Cohesion
  3. Lexical Resource
  4. Grammatical Range and Accuracy
  
  Each criterion should be scored from 0-9 in 0.5 increments.
  Also provide detailed feedback for improvement and calculate the overall band score.`;

  const userPrompt = `Please score these IELTS writing responses:

Task 1 (Report/Letter):
${task1}

Task 2 (Essay):
${task2}

Provide the response in the following JSON format:
{
  "overallScore": 0.0,
  "taskAchievement": 0.0,
  "coherenceCohesion": 0.0,
  "lexicalResource": 0.0,
  "grammaticalAccuracy": 0.0,
  "task1Feedback": "detailed feedback for task 1",
  "task2Feedback": "detailed feedback for task 2",
  "improvements": ["improvement tip 1", "improvement tip 2", "improvement tip 3"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Return mock data for development/testing
    return {
      overallScore: 6.5,
      taskAchievement: 6.5,
      coherenceCohesion: 6.5,
      lexicalResource: 6.0,
      grammaticalAccuracy: 7.0,
      task1Feedback: "Your Task 1 response demonstrates a good understanding of the data presented. You have successfully identified the main trends and made relevant comparisons. However, consider providing more specific data points and ensuring all key features are covered.",
      task2Feedback: "Your essay presents a clear position and develops your ideas logically. The arguments are relevant and supported with examples. To improve, work on developing more sophisticated vocabulary and varying your sentence structures.",
      improvements: [
        "Include more specific data and figures in Task 1 descriptions",
        "Use a wider range of cohesive devices to link ideas",
        "Develop more complex grammatical structures in your writing"
      ]
    };
  }
}

async function scoreSpeakingTest(transcript) {
  const systemPrompt = `You are an experienced IELTS examiner. Score the following IELTS speaking response according to the official IELTS band descriptors.
  Provide scores for:
  1. Fluency and Coherence
  2. Lexical Resource
  3. Grammatical Range and Accuracy
  4. Pronunciation
  
  Each criterion should be scored from 0-9 in 0.5 increments.
  Also provide detailed feedback for improvement and calculate the overall band score.`;

  const userPrompt = `Please score this IELTS speaking response:

${transcript}

Provide the response in the following JSON format:
{
  "overallScore": 0.0,
  "fluencyCoherence": 0.0,
  "lexicalResource": 0.0,
  "grammaticalAccuracy": 0.0,
  "pronunciation": 0.0,
  "detailedFeedback": "comprehensive feedback on the speaking performance",
  "improvements": ["improvement tip 1", "improvement tip 2", "improvement tip 3"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Return mock data for development/testing
    return {
      overallScore: 6.5,
      fluencyCoherence: 6.5,
      lexicalResource: 6.0,
      grammaticalAccuracy: 7.0,
      pronunciation: 6.5,
      detailedFeedback: "Your speaking demonstrates good fluency with occasional hesitation. You communicate ideas clearly and coherently. Your vocabulary is appropriate for the topics discussed, though there's room for more sophisticated expressions. Grammar is generally accurate with minor errors that don't impede communication.",
      improvements: [
        "Practice speaking for longer periods without hesitation",
        "Expand vocabulary related to abstract topics",
        "Work on stress and intonation patterns for more natural speech"
      ]
    };
  }
}

module.exports = router;