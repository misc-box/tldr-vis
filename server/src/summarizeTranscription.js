
import fetch from 'node-fetch';

const { OPENAI_API_KEY } = useRuntimeConfig();

async function summarizeText(text, summaryLength = 'short', type = 'text', otherOptions = {}) {
    // Definieren der Systemanweisung
    let instruction = '';
    switch (summaryLength) {
        case 'short':
            instruction = `Provide a SHORT summary of this lecture transcript, with bullet points but ONLY elaborating on
            the most important and pressing content. 
            Only include content you are sure of! Lecture transcript: `;
            break;
        case 'long':
            instruction = `Provide a LONG AND DETAILED summary of this lecture transcript by defining key concepts, working with
            bullet points to include AS MUCH RELEVANT INFORMATION AS POSSIBLE into the summary. 
            Only include content you are sure of! Lecture transcript:`;
            break;
        case 'medium':
            instruction = `Provide a medium-long summary of this lecture transcript with bullet points and short texts. 
            Only include content you are sure of! Lecture transcript:`;
            break;
        default:
            throw new Error('Invalid summary length');

    }
    switch (type) {
        case 'text':
            instruction += ' ';
            break;
        case 'latex':
            instruction += ' The summary should be written in LaTeX code. ';
            break;
        default:
            throw new Error('Invalid summary type');
    }
    const systemInstruction = {
        role: "system",
        content: instruction,
    };
    // Definieren der Benutzeranweisung
    const userInstruction = {
        role: "user",
        content: text,
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
    return data.choices[0]['message']['content'].trim();
}

export default summarizeText;

