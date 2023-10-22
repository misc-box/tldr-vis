import axios from "axios";
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const { OPENAI_API_KEY } = useRuntimeConfig();
//import config from '../config.js';
//const { OPENAI_API_KEY } = config;

async function sendToWhisper(audioFile) {
    const formData = new FormData();
    formData.append('model', 'whisper-1');
    formData.append('file', fs.createReadStream(audioFile));

    // Log the file size and length and name
    const stats = fs.statSync(audioFile);
    console.log('File size:', stats.size);
    console.log('File name:', audioFile);
    console.log('File length:', stats.size / 32000);  // length in seconds

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            ...formData.getHeaders(),
        },
    });

    return response.data.text;
}

async function transcribeAudio(audioDir) {
    const audioFiles = fs.readdirSync(audioDir).map(file => path.join(audioDir, file));
    let transcription = '';
    for (const audioFile of audioFiles) {
        const currentTranscription = await sendToWhisper(audioFile);
        transcription += currentTranscription + '\n';
    }
    return transcription;
}

export { transcribeAudio };
