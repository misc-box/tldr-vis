
import fetch from 'node-fetch';

import config from './config.js';



async function summarizeText(text, summaryLength = 'short', otherOptions = {}) {
    // Definieren der Systemanweisung
    const systemInstruction = {
        role: "system",
        content: "You are a knowledgeable assistant tasked with summarizing lectures. When provided with a lecture transcript, generate a clear and concise summary. If instructed to provide a long summary, include more details, key points, and explanations. If instructed to provide a short summary, offer a brief overview highlighting the main points. Format your response in a clear, readable manner."
    };

    // Definieren der Benutzeranweisung
    const userInstruction = {
        role: "user",
        content: `Provide a ${summaryLength} summary for the following lecture text: \n\n${text}`
    };

    // Zusammenstellen der Nachrichten für den API-Aufruf
    const messages = [systemInstruction, userInstruction];

    // Weitere benutzerdefinierte Optionen können hier hinzugefügt werden, z.B.:
    // const temperature = otherOptions.temperature || 0.7;

    // Ausführen des API-Aufrufs
    // choose the model based on token length, if more than 3800 use the gpt-3.5-turbo-16k else use the gpt-3.5-turbo
    let model = 'gpt-3.5-turbo';
    // count words
    const wordCount = text.split(/\s+/).length;
    if (wordCount > 2800) {
        model = 'gpt-3.5-turbo-16k';
    }
    console.log('Word count:', wordCount);
    console.log('Model:', model);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.OPENAI_API_KEY}`,
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
    return data.choices[0]['message']['content'].trim();
}

export default summarizeText;

