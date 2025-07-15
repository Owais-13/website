# Audio Files Setup Guide

## Quick Start

1. **Add your audio files** to the appropriate directories:
   - `audio/listening/beginner/` - For beginner level tests
   - `audio/listening/intermediate/` - For intermediate level tests
   - `audio/listening/advanced/` - For advanced level tests

2. **Naming convention**:
   - `test1_section1.mp3` - Test 1, Section 1
   - `test1_section2.mp3` - Test 1, Section 2
   - etc.

3. **Update configuration** in `js/audio-config.js` with your audio file information.

## Free Audio Sources

### British Council
Visit: https://takeielts.britishcouncil.org/

Sample audio links that work:
```
https://takeielts.britishcouncil.org/sites/default/files/2018-01/Listening_sample_task_1.mp3
```

### IELTS.org
Visit: https://www.ielts.org/for-test-takers/sample-test-questions

### Cambridge English
Visit: https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/

## Using External Audio URLs

Instead of hosting files locally, you can use external URLs:

1. **Google Drive**:
   - Upload MP3 to Google Drive
   - Right-click → "Get link"
   - Change to "Anyone with the link"
   - Use format: `https://drive.google.com/uc?export=download&id=YOUR_FILE_ID`

2. **Dropbox**:
   - Upload to Dropbox
   - Get sharing link
   - Change `?dl=0` to `?dl=1` at the end
   - Example: `https://www.dropbox.com/s/abc123/audio.mp3?dl=1`

3. **GitHub** (files under 100MB):
   - Upload to your repository
   - Use raw URL: `https://raw.githubusercontent.com/username/repo/main/audio.mp3`

## Audio Format Requirements

- **Format**: MP3 (recommended), M4A, or OGG
- **Bitrate**: 128kbps (optimal balance of quality and size)
- **Channels**: Mono (smaller file size) or Stereo
- **Sample Rate**: 44.1kHz or 48kHz
- **Duration**: 5-7 minutes per section

## Example Configuration

Edit `js/audio-config.js`:

```javascript
localAudio: {
    beginner: {
        test1: {
            section1: {
                audioUrl: "audio/listening/beginner/test1_section1.mp3",
                duration: "5:30",
                transcript: "Full transcript here...",
                questions: [
                    // Add your questions
                ]
            }
        }
    }
}
```

## Testing Your Audio

1. Open `listening-test.html` in your browser
2. Select difficulty level
3. Start the test
4. Verify audio plays correctly

## Troubleshooting

### Audio not playing?
- Check file path is correct
- Ensure file format is supported (MP3 recommended)
- Check browser console for errors
- Verify CORS settings if using external URLs

### CORS Issues?
If hosting on external server, ensure proper CORS headers:
```
Access-Control-Allow-Origin: *
```

### File too large?
Compress using FFmpeg:
```bash
ffmpeg -i input.mp3 -b:a 128k output.mp3
```

## Legal Notice

- Only use audio you have rights to use
- Respect copyright laws
- Give proper attribution when required
- For commercial use, obtain proper licenses

## Need Help?

Check the main documentation files:
- `AUDIO_RESOURCES_GUIDE.md` - Comprehensive audio guide
- `IELTS_AI_SETUP.md` - Full system setup guide