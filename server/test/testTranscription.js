

import sendToWhisper from '../src/transcribeAudio.js';

// Test the transcription function
sendToWhisper('./test_data/01LeggedRobot.mp3')
    .then(transcription => console.log('Transcription:', transcription))
    .catch(error => console.error('Error:', error));
