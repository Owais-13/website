// Configuration file for VisaFluent IELTS Assessment System
// Copy this file to config.local.js and update with your actual API keys

const CONFIG = {
    // OpenAI Configuration
    OPENAI: {
        API_KEY: 'your-openai-api-key-here', // Replace with your actual OpenAI API key
        API_URL: 'https://api.openai.com/v1/chat/completions',
        MODEL: 'gpt-4', // or 'gpt-3.5-turbo' for cost optimization
        MAX_TOKENS: 2000,
        TEMPERATURE: 0.3
    },
    
    // Assessment Settings
    ASSESSMENT: {
        WRITING_TIME_LIMIT: 60 * 60, // 60 minutes in seconds
        MIN_WORDS_TASK1: 150,
        MIN_WORDS_TASK2: 250,
        SPEAKING_TIME_LIMIT: 14 * 60 // 14 minutes in seconds
    },
    
    // UI Settings
    UI: {
        SHOW_WORD_COUNT: true,
        SHOW_TIMER: true,
        AUTO_SUBMIT: true,
        NOTIFICATION_DURATION: 5000 // 5 seconds
    },
    
    // Demo Mode (when API key is not configured)
    DEMO: {
        ENABLED: true,
        MOCK_SCORES: true,
        REALISTIC_VARIATION: 0.5
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}