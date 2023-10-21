import FuzzySet from 'fuzzyset.js';
import fetch from 'node-fetch';
import config from './config.js';
async function extractTopics(text, otherOptions = {}) {
    // Define system instruction
    const systemInstruction = {
        role: "system",
        content: `Extract and prioritize the main topics from the following lecture transcript. Start with the most important topic and work your way down.
        For each topic, provide a level of relevance (high, medium, low) based on the depth and frequency of coverage in the lecture, and also estimate the percentage of the lecture dedicated to each topic. The minimum percentage is 10% and the sum is 100%.
        Additionally, identify the main sub-topics within each key topic. 
        For each key topic, provide an interesting additional question based on the lecture to help delve deeper into the material. 
        Format the output as valid json, in the following structure: {"1": {"name": "topic 1", "priority": "relevance", "percentage": "XX%", "sub-topics": ["sub-topic A", "sub-topic B", ...], "question": "blabla"}, "2": {"name": "topic 2", "priority": "relevance", "percentage": "XX%",  "sub-topics": ["sub-topic A", "sub-topic B", ...], "question": "blabla"}, ...}. 
        Take a deep breath and think carefully.
        Lecture transcript:

        `
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
            'Authorization': `Bearer ${config.OPENAI_API_KEY}`,
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
