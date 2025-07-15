# VisaFluent IELTS Assessment System

A comprehensive IELTS preparation platform with AI-powered assessment capabilities using OpenAI integration.

## Features

### 🎯 AI-Powered IELTS Assessment
- **Writing Assessment**: Evaluate Task 1 and Task 2 responses with detailed scoring
- **Speaking Assessment**: Record and analyze speaking performance with voice recognition
- **Real-time Feedback**: Get instant scoring and detailed feedback for improvement
- **Band Score Calculation**: Accurate IELTS band scoring (0-9) for all criteria

### 📊 Assessment Criteria

#### Writing Assessment
- **Task Achievement**: How well the response addresses the task requirements
- **Coherence and Cohesion**: Logical flow and use of cohesive devices
- **Lexical Resource**: Vocabulary range and accuracy
- **Grammatical Range and Accuracy**: Grammar usage and sentence structure

#### Speaking Assessment
- **Fluency and Coherence**: Speaking flow and logical connection
- **Lexical Resource**: Vocabulary usage and appropriateness
- **Grammatical Range and Accuracy**: Grammar accuracy and complexity
- **Pronunciation**: Clarity and natural pronunciation

### 🚀 Key Features

- **Timer System**: 60-minute countdown for writing assessments
- **Voice Recording**: Built-in microphone recording for speaking tests
- **Word Count**: Automatic word counting for writing tasks
- **Detailed Feedback**: Comprehensive feedback with improvement suggestions
- **Mock Data**: Demo mode with realistic scoring for testing

## Setup Instructions

### 1. OpenAI API Configuration

To enable full AI functionality, you need to configure your OpenAI API key:

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Open `js/ielts-assessment.js`
3. Replace `'your-openai-api-key-here'` with your actual API key:

```javascript
const OPENAI_API_KEY = 'sk-your-actual-api-key-here';
```

### 2. File Structure

```
├── index.html                 # Main homepage
├── ielts-assessment.html      # IELTS Assessment page
├── practice.html              # Practice tests page
├── js/
│   ├── ielts-assessment.js   # Assessment functionality
│   └── main.js              # Main site functionality
├── css/
│   └── style.css            # Styling
└── images/                  # Image assets
```

### 3. Running the Application

1. **Local Development**: Open `index.html` in a web browser
2. **Web Server**: Use a local web server for full functionality:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

## API Integration

### OpenAI API Endpoints Used

- **Chat Completions**: For writing and speaking assessment analysis
- **Whisper API**: For speech-to-text conversion (planned feature)

### Assessment Process

1. **User Input**: User provides writing responses or voice recordings
2. **Data Processing**: Responses are formatted for AI analysis
3. **OpenAI Analysis**: AI evaluates responses using IELTS criteria
4. **Result Generation**: Structured feedback and scores are generated
5. **Display**: Results are presented with detailed breakdown

## Customization

### Adding New Assessment Types

1. Create new assessment section in `ielts-assessment.html`
2. Add corresponding JavaScript functions in `ielts-assessment.js`
3. Update the assessment selection logic

### Modifying Scoring Criteria

Edit the prompt templates in `createWritingAssessmentPrompt()` and `createSpeakingAssessmentPrompt()` functions to adjust assessment criteria.

### Styling Customization

Modify the CSS in `ielts-assessment.html` to match your brand colors and design preferences.

## Security Considerations

### API Key Security

- **Never commit API keys** to version control
- Use environment variables in production
- Implement rate limiting for API calls
- Consider using a backend proxy for API calls

### Data Privacy

- User responses are sent to OpenAI for analysis
- No data is permanently stored on the server
- Consider implementing data retention policies

## Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

### Required Features

- **MediaRecorder API**: For voice recording
- **Fetch API**: For OpenAI API calls
- **ES6+ Support**: For modern JavaScript features

## Troubleshooting

### Common Issues

1. **Microphone Access Denied**
   - Check browser permissions
   - Ensure HTTPS in production
   - Test microphone functionality

2. **OpenAI API Errors**
   - Verify API key is correct
   - Check API usage limits
   - Ensure proper CORS configuration

3. **Recording Not Working**
   - Check browser compatibility
   - Verify microphone permissions
   - Test with different browsers

### Debug Mode

Enable console logging by checking the browser's developer tools for detailed error messages and API responses.

## Future Enhancements

### Planned Features

- **Reading Assessment**: AI-powered reading comprehension tests
- **Listening Assessment**: Audio-based listening tests
- **Progress Tracking**: User progress over time
- **Personalized Learning**: AI-driven study recommendations
- **Mobile App**: Native mobile application
- **Offline Mode**: Basic functionality without internet

### Technical Improvements

- **Backend Integration**: Server-side processing for better security
- **Database Storage**: User progress and assessment history
- **Real-time Collaboration**: Live tutoring features
- **Advanced Analytics**: Detailed performance insights

## Support

For technical support or feature requests, please contact:
- Email: info@visafluent.com
- Website: https://visafluent.com

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This system is designed for educational purposes and should not replace official IELTS preparation materials or professional tutoring services.