import FuzzySet from 'fuzzyset.js';
import fetch from 'node-fetch';
import readTextFile from './readTextFile.js';

const { OPENAI_API_KEY } = useRuntimeConfig();

async function extractTopics(text, otherOptions = {}) {
    // Define system instruction
    const systemInstruction = {
        role: "system",
        content: await readTextFile('server/src/instructions//extractTopics.txt')
    };

    // Define user instruction
    const userInstruction = {
        role: "user",
        content: text
    };

    // Assemble messages for API call
    const messages = [systemInstruction, userInstruction];

    // Choose model based on token length
    let model = 'gpt-3.5-turbo';
    const wordCount = text.split(/\s+/).length;
    if (wordCount > 2800) {
        model = 'gpt-3.5-turbo-16k';
    }
    console.log('Word count:', wordCount);
    console.log('Model:', model);

    // Execute API call
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

    // Evaluate response
    const data = await response.json();
    console.log(data.usage);



    // The output is assumed to be formatted correctly as per the instruction
    let output = data.choices[0]['message']['content'].trim();

    // try to  convert to json else console log
    try {
        output = JSON.parse(output);

        //output = await countTopicOccurrences(output, text);
    } catch (error) {
        console.log(output);
        console.log('Error parsing output:', error.message);
    }



    return output;
}



async function countTopicOccurrences(topicsJson, transcriptText) {
    const words = transcriptText.split(/\s+/);

    for (const topicKey in topicsJson) {
        const topicName = topicsJson[topicKey].name;
        const fuzzySet = FuzzySet([topicName]);

        let count = 0;
        for (const word of words) {
            const result = fuzzySet.get(word);
            if (result && result[0][0] > 0.8) {  // Adjust the 0.8 threshold to your needs
                count++;
            }
        }

        topicsJson[topicKey].occurrences = count;
    }

    console.log(topicsJson);
    return topicsJson;
}

export default extractTopics;
