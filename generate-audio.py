#!/usr/bin/env python3
"""
IELTS Audio Generator
This script generates sample IELTS listening audio files using text-to-speech.
"""

import os
import subprocess
import sys

# Sample IELTS listening scripts
AUDIO_SCRIPTS = {
    'beginner': {
        'test1_section1': {
            'text': '''
            Receptionist: Good morning, City Fitness Center. How can I help you?
            Customer: Hi, I'd like to inquire about membership options. My name is Sarah Johnson.
            Receptionist: Nice to meet you Sarah. Let me tell you about our packages. 
            We have monthly membership for 50 pounds, quarterly for 140 pounds, and annual for 480 pounds.
            Customer: The annual membership sounds good. What's included?
            Receptionist: It includes access to all gym equipment, swimming pool, and group classes.
            Customer: Perfect! Can I pay by card? My phone number is 07700 900123.
            Receptionist: Yes, we accept all major cards. Let me process your annual membership now.
            ''',
            'filename': 'audio/listening/beginner/test1_section1.mp3'
        },
        'test1_section2': {
            'text': '''
            Welcome to the National History Museum. I'm your guide today, and I'll be showing you around our fascinating exhibitions.
            Our museum was founded in 1856 and houses over 80 million specimens. We're open from 9 AM to 6 PM daily.
            The main entrance is on Exhibition Road, and tickets cost 15 pounds for adults and 8 pounds for students.
            The dinosaur gallery is our most popular attraction, located on the ground floor. 
            Don't miss the blue whale skeleton in the main hall - it's 26 meters long!
            ''',
            'filename': 'audio/listening/beginner/test1_section2.mp3'
        },
        'test1_section3': {
            'text': '''
            Student A: Have you started working on our environmental science project yet?
            Student B: Yes, I've been researching renewable energy sources. What about you?
            Student A: I'm focusing on solar panel efficiency. Did you know that modern panels can convert 22% of sunlight into electricity?
            Student B: That's impressive! I found that wind turbines can generate power for 1,500 homes each.
            Student A: We should include statistics about carbon footprint reduction too.
            Student B: Good idea. The deadline is next Friday, so we have plenty of time to prepare.
            ''',
            'filename': 'audio/listening/beginner/test1_section3.mp3'
        },
        'test1_section4': {
            'text': '''
            Today's lecture focuses on climate change and its impact on global ecosystems.
            Climate change refers to long-term shifts in global temperatures and weather patterns.
            Since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels.
            The average global temperature has risen by approximately 1.1 degrees Celsius since pre-industrial times.
            This has resulted in melting ice caps, rising sea levels, and more frequent extreme weather events.
            Scientists predict that without immediate action, temperatures could rise by 3 to 5 degrees by 2100.
            ''',
            'filename': 'audio/listening/beginner/test1_section4.mp3'
        }
    }
}

def check_dependencies():
    """Check if required dependencies are installed."""
    try:
        # Check if espeak is available (for Linux/macOS)
        subprocess.run(['espeak', '--version'], capture_output=True, check=True)
        return 'espeak'
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    
    try:
        # Check if say is available (for macOS)
        subprocess.run(['say', '-v', '?'], capture_output=True, check=True)
        return 'say'
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    
    # Check if pyttsx3 is available
    try:
        import pyttsx3
        return 'pyttsx3'
    except ImportError:
        pass
    
    return None

def generate_audio_with_say(text, output_file):
    """Generate audio using macOS 'say' command."""
    try:
        # Create output directory if it doesn't exist
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        # Generate audio using say command
        cmd = ['say', '-o', output_file.replace('.mp3', '.aiff'), text]
        subprocess.run(cmd, check=True)
        
        # Convert to mp3 if ffmpeg is available
        try:
            cmd_convert = ['ffmpeg', '-i', output_file.replace('.mp3', '.aiff'), 
                          '-acodec', 'mp3', '-y', output_file]
            subprocess.run(cmd_convert, check=True, capture_output=True)
            # Remove the temporary .aiff file
            os.remove(output_file.replace('.mp3', '.aiff'))
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            # If ffmpeg is not available, keep the .aiff file
            print(f"Generated {output_file.replace('.mp3', '.aiff')} (ffmpeg not available for mp3 conversion)")
            return True
            
    except subprocess.CalledProcessError as e:
        print(f"Error generating audio with 'say': {e}")
        return False

def generate_audio_with_pyttsx3(text, output_file):
    """Generate audio using pyttsx3."""
    try:
        import pyttsx3
        
        # Create output directory if it doesn't exist
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        engine = pyttsx3.init()
        engine.setProperty('rate', 150)  # Speed of speech
        engine.setProperty('volume', 0.8)  # Volume level (0.0 to 1.0)
        
        # Save to file
        engine.save_to_file(text, output_file.replace('.mp3', '.wav'))
        engine.runAndWait()
        
        print(f"Generated {output_file.replace('.mp3', '.wav')}")
        return True
        
    except Exception as e:
        print(f"Error generating audio with pyttsx3: {e}")
        return False

def create_sample_audio():
    """Create sample audio files for IELTS listening practice."""
    print("🎵 Generating IELTS Listening Audio Files...")
    
    tts_engine = check_dependencies()
    
    if not tts_engine:
        print("❌ No text-to-speech engine found!")
        print("\nTo generate audio files, please install one of the following:")
        print("• macOS: 'say' command (built-in)")
        print("• Python: pip install pyttsx3")
        print("• Linux: sudo apt-get install espeak")
        return False
    
    print(f"✅ Using {tts_engine} for text-to-speech")
    
    success_count = 0
    
    for level, tests in AUDIO_SCRIPTS.items():
        print(f"\n📁 Generating {level} level audio files...")
        
        for test_name, test_data in tests.items():
            text = test_data['text'].strip()
            output_file = test_data['filename']
            
            print(f"  🎤 Creating {output_file}...")
            
            if tts_engine == 'say':
                success = generate_audio_with_say(text, output_file)
            elif tts_engine == 'pyttsx3':
                success = generate_audio_with_pyttsx3(text, output_file)
            
            if success:
                success_count += 1
                print(f"  ✅ Created {output_file}")
            else:
                print(f"  ❌ Failed to create {output_file}")
    
    print(f"\n🎉 Generated {success_count} audio files successfully!")
    return success_count > 0

if __name__ == "__main__":
    if create_sample_audio():
        print("\n🚀 Audio files generated! Your IELTS listening section is ready to test.")
        print("\n📝 Next steps:")
        print("1. Start your web server: python3 -m http.server 8000")
        print("2. Open http://localhost:8000")
        print("3. Navigate to IELTS Assessment")
        print("4. Test the listening section")
    else:
        print("\n💡 Alternative: You can manually add your own IELTS audio files to:")
        print("   - audio/listening/beginner/")
        print("   - audio/listening/intermediate/")
        print("   - audio/listening/advanced/") 