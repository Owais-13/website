// OpenAI Configuration for IELTS Scoring
const OPENAI_CONFIG = {
    // Replace with your actual OpenAI API key
    apiKey: 'YOUR_OPENAI_API_KEY',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4',
    
    // IELTS Scoring Criteria
    scoringCriteria: {
        writing: {
            taskResponse: {
                weight: 0.25,
                description: 'Task Achievement/Response'
            },
            coherenceCohesion: {
                weight: 0.25,
                description: 'Coherence and Cohesion'
            },
            lexicalResource: {
                weight: 0.25,
                description: 'Lexical Resource'
            },
            grammaticalRange: {
                weight: 0.25,
                description: 'Grammatical Range and Accuracy'
            }
        },
        speaking: {
            fluencyCoherence: {
                weight: 0.25,
                description: 'Fluency and Coherence'
            },
            lexicalResource: {
                weight: 0.25,
                description: 'Lexical Resource'
            },
            grammaticalRange: {
                weight: 0.25,
                description: 'Grammatical Range and Accuracy'
            },
            pronunciation: {
                weight: 0.25,
                description: 'Pronunciation'
            }
        }
    }
};

// Function to initialize OpenAI
function initializeOpenAI() {
    if (!OPENAI_CONFIG.apiKey || OPENAI_CONFIG.apiKey === 'YOUR_OPENAI_API_KEY') {
        console.error('Please set your OpenAI API key in js/openai-config.js');
        return false;
    }
    return true;
}