import fetch from 'node-fetch';
import axios from "axios";

import FormData from 'form-data';
import fs from 'fs';

const { OPENAI_API_KEY } = useRuntimeConfig();

async function sendToWhisper(audioPath) {
    const formData = new FormData();
    formData.append('model', 'whisper-1');
    formData.append('file', fs.createReadStream(audioPath));
    // log the file size and length and name
    const stats = fs.statSync(audioPath);
    console.log('File size:', stats.size);
    console.log('File name:', audioPath);
    console.log('File length:', stats.size);
    // length in seconds
    const length = stats.size / 32000;
    console.log('File length in seconds:', length);

    console.log(formData)

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            ...formData.getHeaders(),
        },
    });

    const data = await response.data;
    console.log(data);

    return data.text;
}

export default sendToWhisper;
