// IELTS Listening Test Audio Configuration
// This file contains all audio sources and related data for the listening tests

const AUDIO_CONFIG = {
    // Free audio resources from official sources
    officialSources: {
        britishCouncil: {
            sample1: {
                url: "https://takeielts.britishcouncil.org/sites/default/files/2018-01/Listening_sample_task_1.mp3",
                transcript: "https://takeielts.britishcouncil.org/sites/default/files/2018-01/Listening_sample_task_1_transcript.pdf",
                answers: "https://takeielts.britishcouncil.org/sites/default/files/2018-01/Listening_sample_task_1_answers.pdf"
            }
        },
        cambridge: {
            // Add Cambridge audio URLs here when available
        }
    },
    
    // Local audio files (place your files in the audio/listening directory)
    localAudio: {
        beginner: {
            test1: {
                section1: {
                    audioUrl: "audio/listening/beginner/test1_section1.wav",
                    duration: "5:30",
                    transcript: `
                        Receptionist: Good morning, City Fitness Center. How can I help you?
                        Customer: Hi, I'd like to inquire about membership options.
                        Receptionist: Of course! We have several membership packages available...
                    `,
                    questions: [
                        {
                            number: 1,
                            type: "completion",
                            question: "Customer name: _______",
                            answer: "Sarah Johnson",
                            instruction: "Write NO MORE THAN TWO WORDS"
                        },
                        {
                            number: 2,
                            type: "completion",
                            question: "Phone number: _______",
                            answer: "07700 900123",
                            instruction: "Write NUMBERS ONLY"
                        },
                        {
                            number: 3,
                            type: "multiple-choice",
                            question: "What type of membership does the customer choose?",
                            options: [
                                "A) Monthly",
                                "B) Quarterly",
                                "C) Annual",
                                "D) Student"
                            ],
                            answer: "C"
                        }
                    ]
                },
                section2: {
                    audioUrl: "audio/listening/beginner/test1_section2.wav",
                    duration: "5:45",
                    transcript: "Tour guide speech about local museum...",
                    questions: []
                },
                section3: {
                    audioUrl: "audio/listening/beginner/test1_section3.wav",
                    duration: "6:00",
                    transcript: "Students discussing project...",
                    questions: []
                },
                section4: {
                    audioUrl: "audio/listening/beginner/test1_section4.wav",
                    duration: "6:15",
                    transcript: "Lecture on environmental science...",
                    questions: []
                }
            }
        },
        
        intermediate: {
            test1: {
                section1: {
                    audioUrl: "audio/listening/intermediate/test1_section1.mp3",
                    duration: "5:45",
                    transcript: "Hotel booking conversation...",
                    questions: []
                }
                // Add more sections...
            }
        },
        
        advanced: {
            test1: {
                section1: {
                    audioUrl: "audio/listening/advanced/test1_section1.mp3",
                    duration: "6:00",
                    transcript: "Complex accommodation arrangements...",
                    questions: []
                }
                // Add more sections...
            }
        }
    },
    
    // External audio URLs (for demo/testing)
    demoAudio: {
        // These are placeholder URLs - replace with actual IELTS-style audio
        section1: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        section2: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        section3: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        section4: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    
    // Cloud storage options (examples)
    cloudStorage: {
        googleDrive: {
            // How to use Google Drive for audio hosting:
            // 1. Upload your MP3 to Google Drive
            // 2. Right-click and select "Get link"
            // 3. Change permission to "Anyone with the link"
            // 4. Replace FILEID in the URL below
            template: "https://drive.google.com/uc?export=download&id=FILEID",
            example: "https://drive.google.com/uc?export=download&id=1a2b3c4d5e6f7g8h9i0j"
        },
        dropbox: {
            // Dropbox direct download link format
            template: "https://www.dropbox.com/s/FILEID/filename.mp3?dl=1",
            example: "https://www.dropbox.com/s/abc123def456/section1.mp3?dl=1"
        },
        awsS3: {
            // Amazon S3 bucket URL format
            template: "https://your-bucket-name.s3.amazonaws.com/path/to/audio.mp3",
            example: "https://ielts-audio.s3.amazonaws.com/listening/test1/section1.mp3"
        }
    },
    
    // Audio quality settings
    quality: {
        high: {
            bitrate: "192kbps",
            format: "mp3",
            channels: "stereo"
        },
        medium: {
            bitrate: "128kbps",
            format: "mp3",
            channels: "mono"
        },
        low: {
            bitrate: "96kbps",
            format: "mp3",
            channels: "mono"
        }
    },
    
    // Band score conversion table
    bandScoreConversion: {
        39: 9.0,
        37: 8.5,
        35: 8.0,
        32: 7.5,
        30: 7.0,
        26: 6.5,
        23: 6.0,
        18: 5.5,
        16: 5.0,
        13: 4.5,
        10: 4.0,
        8: 3.5,
        6: 3.0,
        4: 2.5
    }
};

// Helper function to get audio URL based on test configuration
function getAudioUrl(level, testNumber, sectionNumber) {
    const testKey = `test${testNumber}`;
    const sectionKey = `section${sectionNumber}`;
    
    // Check local audio first
    if (AUDIO_CONFIG.localAudio[level] && 
        AUDIO_CONFIG.localAudio[level][testKey] && 
        AUDIO_CONFIG.localAudio[level][testKey][sectionKey]) {
        return AUDIO_CONFIG.localAudio[level][testKey][sectionKey].audioUrl;
    }
    
    // Fallback to demo audio
    return AUDIO_CONFIG.demoAudio[sectionKey];
}

// Helper function to get questions for a section
function getQuestions(level, testNumber, sectionNumber) {
    const testKey = `test${testNumber}`;
    const sectionKey = `section${sectionNumber}`;
    
    if (AUDIO_CONFIG.localAudio[level] && 
        AUDIO_CONFIG.localAudio[level][testKey] && 
        AUDIO_CONFIG.localAudio[level][testKey][sectionKey]) {
        return AUDIO_CONFIG.localAudio[level][testKey][sectionKey].questions || [];
    }
    
    return [];
}

// Helper function to calculate band score
function calculateBandScore(correctAnswers) {
    const scores = Object.entries(AUDIO_CONFIG.bandScoreConversion);
    
    for (const [minCorrect, bandScore] of scores) {
        if (correctAnswers >= parseInt(minCorrect)) {
            return bandScore;
        }
    }
    
    return 2.0; // Minimum band score
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AUDIO_CONFIG,
        getAudioUrl,
        getQuestions,
        calculateBandScore
    };
}