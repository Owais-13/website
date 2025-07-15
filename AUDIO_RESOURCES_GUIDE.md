# IELTS Audio Resources Guide

## Overview
This guide provides information on where to obtain IELTS listening test audio files and how to integrate them into your practice system.

## Free IELTS Audio Resources

### 1. British Council - Take IELTS
- **Website**: https://takeielts.britishcouncil.org/
- **Free Samples**: Available in the preparation section
- **Format**: MP3 files with transcripts
- **Usage**: Free for personal practice

Example URLs:
```javascript
// Sample listening tests from British Council
const britishCouncilAudio = {
    sample1: "https://takeielts.britishcouncil.org/sites/default/files/2018-01/Listening_sample_task_1.mp3",
    sample2: "https://takeielts.britishcouncil.org/sites/default/files/2018-01/Listening_sample_task_2.mp3"
};
```

### 2. IELTS.org Official Website
- **Website**: https://www.ielts.org/
- **Sample Tests**: Available under "Sample test questions"
- **Includes**: Audio files, questions, and answer keys
- **License**: Free for non-commercial use

### 3. Cambridge English
- **Website**: https://www.cambridgeenglish.org/
- **Resources**: Sample papers with audio
- **Quality**: Official Cambridge materials
- **Access**: Some free, some require purchase

### 4. IDP IELTS
- **Website**: https://www.ieltsidpindia.com/
- **Materials**: Practice tests with audio
- **Format**: Online streaming and downloads
- **Cost**: Mix of free and paid content

## Setting Up Audio Files

### Directory Structure
Create the following directory structure in your project:
```
audio/
├── listening/
│   ├── beginner/
│   │   ├── section1.mp3
│   │   ├── section2.mp3
│   │   ├── section3.mp3
│   │   └── section4.mp3
│   ├── intermediate/
│   │   ├── section1.mp3
│   │   ├── section2.mp3
│   │   ├── section3.mp3
│   │   └── section4.mp3
│   └── advanced/
│       ├── section1.mp3
│       ├── section2.mp3
│       ├── section3.mp3
│       └── section4.mp3
└── transcripts/
    ├── beginner/
    ├── intermediate/
    └── advanced/
```

### Implementation in Code
Update the `listening-test.html` file with your audio URLs:

```javascript
const testData = {
    beginner: {
        section1: {
            audioUrl: 'audio/listening/beginner/section1.mp3',
            transcript: 'Full transcript text here...',
            questions: [
                // Your questions here
            ]
        }
    }
};
```

## Creating Your Own Audio Content

### Recording Equipment
- **Microphone**: Use a good quality USB microphone
- **Software**: Audacity (free), Adobe Audition, or GarageBand
- **Format**: Export as MP3, 128kbps, mono

### Recording Guidelines
1. **Accents**: Use native speakers with various English accents
2. **Speed**: Normal conversational pace
3. **Background**: Add realistic background noise for some sections
4. **Length**: 
   - Section 1: 5-6 minutes
   - Section 2: 5-6 minutes
   - Section 3: 5-6 minutes
   - Section 4: 5-6 minutes

### Script Writing Tips
- **Section 1**: Two speakers, everyday social context
- **Section 2**: One speaker, everyday social context
- **Section 3**: 2-4 speakers, educational/training context
- **Section 4**: One speaker, academic lecture

## Using External Audio Hosting

### Option 1: Cloud Storage (Recommended)
```javascript
// Google Drive Example
const audioUrls = {
    section1: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"
};

// Dropbox Example
const audioUrls = {
    section1: "https://www.dropbox.com/s/YOUR_FILE_ID/section1.mp3?dl=1"
};
```

### Option 2: CDN Services
- **Cloudinary**: Free tier available
- **Amazon S3**: Pay-as-you-go
- **Azure Blob Storage**: Free tier available

### Option 3: GitHub (Small Files Only)
```javascript
// For files under 100MB
const audioUrls = {
    section1: "https://raw.githubusercontent.com/yourusername/yourrepo/main/audio/section1.mp3"
};
```

## Legal Considerations

### Copyright
- Always respect copyright laws
- Use only licensed or self-created content
- Attribute sources when required

### Fair Use
- Educational purposes generally allow limited use
- Don't redistribute copyrighted materials
- Link to official sources when possible

## Sample Audio Integration

### Basic Implementation
```javascript
// In listening-test.html
const audioSources = {
    free: {
        britishCouncil: {
            listening1: "https://takeielts.britishcouncil.org/sites/default/files/listening_sample_1.mp3",
            transcript1: "https://takeielts.britishcouncil.org/sites/default/files/listening_sample_1_transcript.pdf"
        }
    },
    custom: {
        beginner: {
            section1: "audio/custom/beginner/section1.mp3",
            section2: "audio/custom/beginner/section2.mp3"
        }
    }
};
```

### Advanced Features
```javascript
// Adaptive streaming for different connection speeds
function getAudioQuality() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        if (connection.effectiveType === '4g') {
            return 'high'; // 192kbps
        } else if (connection.effectiveType === '3g') {
            return 'medium'; // 128kbps
        }
    }
    return 'low'; // 96kbps
}

// Load appropriate quality
const quality = getAudioQuality();
const audioUrl = `audio/listening/${quality}/section1.mp3`;
```

## Troubleshooting

### Common Issues
1. **CORS Errors**: Use proper headers or host files on same domain
2. **File Size**: Compress audio without losing quality
3. **Buffering**: Implement preloading for smooth playback
4. **Browser Support**: Test across different browsers

### Audio Optimization
```bash
# Using FFmpeg to optimize audio files
ffmpeg -i input.mp3 -codec:a libmp3lame -b:a 128k output.mp3

# Convert to multiple formats for compatibility
ffmpeg -i input.mp3 -c:a libvorbis -q:a 4 output.ogg
ffmpeg -i input.mp3 -c:a aac -b:a 128k output.m4a
```

## Recommended Audio Sources

### Free Resources
1. **LibriVox**: Public domain audiobooks
2. **BBC Learning English**: Educational content
3. **VOA Learning English**: News and features
4. **TED Talks**: Academic style presentations

### Paid Resources
1. **Cambridge IELTS Books**: Official practice tests
2. **Barron's IELTS**: Comprehensive materials
3. **Collins IELTS**: Practice tests with audio
4. **Official IELTS Practice Materials**: From IDP/British Council

## Implementation Checklist

- [ ] Create audio directory structure
- [ ] Obtain or create audio files
- [ ] Convert to appropriate format (MP3, 128kbps)
- [ ] Create transcripts for each audio
- [ ] Write questions for each section
- [ ] Test audio playback across browsers
- [ ] Implement fallback for unsupported formats
- [ ] Add loading indicators
- [ ] Test on mobile devices
- [ ] Ensure accessibility compliance

## Accessibility Features

### For Hearing Impaired Users
- Provide complete transcripts
- Add visual cues for audio events
- Include subtitles option
- Offer alternative text-based exercises

### Implementation
```javascript
// Add subtitle track
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <track kind="captions" src="captions.vtt" srclang="en" label="English">
</audio>
```

## Next Steps

1. Start with free British Council samples
2. Create your own practice materials
3. Build a library of diverse audio content
4. Regular updates with new materials
5. Gather user feedback for improvements

Remember to always respect copyright and provide proper attribution for any third-party content used in your IELTS practice system.