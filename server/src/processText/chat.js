import fetch from 'node-fetch';
import readTextFile from './readTextFile.js';
import splitTextInput from './splitTextInput.js';

const { OPENAI_API_KEY } = useRuntimeConfig();
//const { OPENAI_API_KEY } = config;

async function chat(transcript, userQuestion) {
    // Definieren der Systemanweisung
    let instruction = await readTextFile('server/src/instructions/chat.txt');

    // Prepare the messages for the API call
    let { model, messages } = splitTextInput(transcript, instruction);

    // Append the user's question as the final message
    messages.push({
        role: "user",
        content: userQuestion,
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
        })
    });

    // Auswertung der Antwort
    const data = await response.json();
    console.log(data.usage);
    return data.choices[0].message.content.trim();
}

export default chat;