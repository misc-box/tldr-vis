import { encoding_for_model } from "tiktoken";

function splitTextInput(text, instruction) {
    let model;
    const enc = encoding_for_model("text-davinci-003");
    let tokenCount = enc.encode(text).length;
    enc.free();
    // if over 16k tokens then split into multiple requests and add to system instruction how many requests come. Then generate 1 final summary.
    if (tokenCount < 16000) {
        if (tokenCount > 4096) {
            model = 'gpt-3.5-turbo-16k';
        } else {
            model = 'gpt-3.5-turbo';
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


    } else {
        model = 'gpt-3.5-turbo-16k';
        // split into multiple requests
        const tokenCountPerRequest = 16000;
        const requestCount = Math.ceil(tokenCount / tokenCountPerRequest);
        let start = 0;
        let end = tokenCountPerRequest;
        const additionalInstruction = ` This is part of a longer text. It will be split into ${requestCount} requests. Perform the task after reading the entire text.`;
        instruction = instruction + additionalInstruction;
        let messages = [systemInstruction];
        for (let i = 0; i < requestCount; i++) {
            const userInstruction = {
                role: "user",
                content: text.substring(start, end),
            };
            messages.push(userInstruction);
            start = end;
            end += tokenCountPerRequest;
        }




    }

    console.log('Token count:', tokenCount);
    console.log('Model:', model);
    return { model, messages };
}

export default splitTextInput;