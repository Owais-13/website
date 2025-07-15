# Audio Files for IELTS Listening Tests

## Overview
This directory contains audio files used for the IELTS listening assessment. The system expects audio files in MP3 format for optimal browser compatibility.

## Required Files

### Current Files
- `sample-listening.mp3` - Sample listening test audio (referenced in ielts-assessment.html)

## Adding New Audio Files

### File Requirements
- **Format**: MP3 (recommended) or WAV
- **Duration**: 2-5 minutes for each listening section
- **Quality**: Clear audio with minimal background noise
- **Content**: IELTS-style listening passages

### File Naming Convention
Use descriptive names that indicate the content:
- `listening-accommodation.mp3`
- `listening-university-life.mp3`
- `listening-travel-arrangements.mp3`

### Integration
To add new audio files:

1. Place the audio file in this directory
2. Update the audio source in `ielts-assessment.html`:
   ```html
   <audio id="listeningAudio" controls>
     <source src="audio/your-new-file.mp3" type="audio/mpeg">
     Your browser does not support the audio element.
   </audio>
   ```

## Content Guidelines

### IELTS Listening Topics
- Academic discussions
- University accommodation
- Travel arrangements
- Library services
- Course registration
- Student services

### Audio Characteristics
- **Speed**: Natural speaking pace
- **Accents**: Various English accents (British, American, Australian)
- **Background**: Minimal ambient noise
- **Clarity**: Clear pronunciation

## Technical Notes

### Browser Compatibility
- MP3 format works in all modern browsers
- WAV format is also supported
- OGG format may not work in all browsers

### File Size
- Keep files under 10MB for faster loading
- Compress audio files appropriately
- Consider using different quality versions for different connection speeds

### Accessibility
- Provide transcripts for hearing-impaired users
- Consider adding captions or subtitles
- Ensure audio controls are keyboard accessible

## Sample Audio Content

### Accommodation Discussion
```
Student: Hi, I'm looking for accommodation near the university.
Staff: Of course! We have several options available. What's your budget?
Student: Around £150 per week would be ideal.
Staff: Perfect! We have a shared house at £150 per week, including utilities.
Student: What facilities are included?
Staff: You'll have your own bedroom, shared kitchen and bathroom, and internet access.
Student: That sounds great! When can I move in?
Staff: The room is available from next Monday. Would you like to see it first?
Student: Yes, that would be helpful. Can I arrange a viewing?
Staff: Absolutely! How about tomorrow at 2 PM?
Student: That works for me. Thank you!
```

This type of content provides realistic IELTS listening practice with natural conversation flow and relevant vocabulary.