import config from './config.js';

import fetch from 'node-fetch';

import readTextFile from './readTextFile.js';
import splitTextInput from './splitTextInput.js';

//const { OPENAI_API_KEY } = useRuntimeConfig();
const { OPENAI_API_KEY } = config;
async function generateQuiz(text) {
    // Definieren der Systemanweisung
    let instruction = '';

    instruction = await readTextFile('server/src/instructions//quiz.txt');


    let model, messages;
    ({ model, messages } = splitTextInput(text, instruction));


    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            // temperature: temperature,  // Falls erforderlich
        })
    });


    // Auswertung der Antwort
    const data = await response.json();
    console.log(data.usage);
    return data.choices[0].message.content.trim();
}

export default generateQuiz;

