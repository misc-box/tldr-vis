
import fetch from 'node-fetch';

import readTextFile from './readTextFile.js';
import splitTextInput from './splitTextInput.js';

//const { OPENAI_API_KEY } = useRuntimeConfig();
import config from '../config.js';
const { OPENAI_API_KEY } = config;
async function summarizeText(text, summaryLength = 'short', otherOptions = {}) {
    // Definieren der Systemanweisung
    let instruction = '';
    switch (summaryLength) {
        case 'short':
            instruction = await readTextFile('server/src/instructions//short.txt');
            break;
        case 'medium':
            instruction = await readTextFile('server/src/instructions//medium.txt');
            break;
        case 'long':
            instruction = await readTextFile('server/src/instructions//long.txt');
            break;
        default:
            throw new Error('Invalid summary length');

    }


    // Weitere benutzerdefinierte Optionen können hier hinzugefügt werden, z.B.:
    // const temperature = otherOptions.temperature || 0.7;

    // Ausführen des API-Aufrufs
    // choose the model based on token length, if more than 3800 use the gpt-3.5-turbo-16k else use the gpt-3.5-turbo
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

export default summarizeText;

