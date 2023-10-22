import fetch from 'node-fetch';
import readTextFile from './readTextFile.js';

export async function summarizeText(text, summaryLength = 'short', otherOptions = {}) {
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
