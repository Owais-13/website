# IELTS Scoring Backend

This Express server exposes a single endpoint that uses OpenAI to predict an IELTS band score and provide feedback for a given Writing or Speaking answer.

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in `backend` directory:

```bash
OPENAI_API_KEY=your_openai_key_here
PORT=4000 # optional
```

3. Run the server in development mode (with auto-reload):

```bash
npm run dev
```

Or run normally:

```bash
npm start
```

The API will be available at `http://localhost:4000/api/ielts-score`.

## Endpoint

POST `/api/ielts-score`

Body JSON schema:

```
{
  "module": "writing" | "speaking", // defaults to "writing"
  "prompt": "Candidate's answer text"
}
```

Successful response:

```
{
  "band": 7.5,
  "feedback": "Your essay demonstrates a clear position throughout..."
}
```

If an error occurs, `error` field will be present.

## How it works

1. The server receives the candidate's answer.
2. Constructs a system prompt instructing the model to act as an IELTS examiner.
3. Calls the ChatCompletion API with `gpt-3.5-turbo` and structured JSON output.
4. Returns the parsed JSON to the front-end.

The front-end modal added in `practice.html` posts directly to this endpoint and shows the returned band and feedback to the user.