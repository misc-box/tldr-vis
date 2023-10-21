

import saveSummaryToPDF from './saveSummaryToPDF.js';
// Import the functions
import fs from 'fs';
// Import the functions
import convertVideoToMp3 from './convertVideoToMp3.js';
import extractTopics from './extractTopics.js';
import readTextFile from './readTextFile.js';
import summarizeTranscription from './summarizeTranscription.js';
import transcribeAudio from './transcribeAudio.js';
import writeTextFile from './writeTextFile.js';
async function processVideo(videoUrl, length = 'short') {
    try {
        // timestamp
        const timestamp = Date.now();
        const outputFolder = './server/output';
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
        }
        // mock to save api calls
        const mock = false;
        let transcription, outputTranscription;
        if (!mock) {
            const audioPath = await convertVideoToMp3(videoUrl, `audio-${timestamp}`);
            transcription = await transcribeAudio(audioPath);

            // delete audio file    
            try {

                // delete audio file
                await fs.promises.unlink(audioPath);
            } catch (error) {
                console.error('Error in processing video:', error.message);
                throw error;
            }
            outputTranscription = `${outputFolder}/transcription-${timestamp}.txt`;
            await writeTextFile(outputTranscription, transcription);

        } else {
            console.log('Using mock data');
            // read sample transcription file to save api calls
            outputTranscription = `./test_data/transcription-123.txt`;
            transcription = await readTextFile(`${outputTranscription}`);
        }

        const summary = await summarizeTranscription(transcription, length);
        const pdfSummary = saveSummaryToPDF(summary, `${outputFolder}/summary-${timestamp}`);

        // extract topics
        const topics = await extractTopics(transcription);

        // Log the extracted topics to the console
        return { pdfPath: pdfSummary, transcriptionPath: outputTranscription, topics: topics }
    } catch (error) {
        console.error('Error in processing video:', error.message);
        throw error;
    }
}



export default processVideo;