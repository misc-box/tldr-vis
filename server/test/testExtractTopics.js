import extractTopics from '../src/extractTopics.js'; // Update with the correct path to your extractTopics file
import readTextFile from '../src/readTextFile.js';
async function testExtractTopics() {
    try {
        // Load the text from the transcription file
        const sampleText = await readTextFile('./test_data/transcription-123.txt');

        // Pass the loaded text to the extractTopics function
        const topics = await extractTopics(sampleText);

        // Log the extracted topics to the console
        console.log('Extracted Topics:', topics);
    } catch (error) {
        // Log any errors that occur
        console.error('Error extracting topics:', error.message);
    }
}


testExtractTopics();
