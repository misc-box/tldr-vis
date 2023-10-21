

import saveSummaryToPDF from './saveSummaryToPDF.js';
// Import the functions
import fs from 'fs';
// Import the functions
import extractTopics from './extractTopics.js';
import readTextFile from './readTextFile.js';
import summarizeTranscription from './summarizeTranscription.js';
import writeTextFile from './writeTextFile.js';
async function processVideo(videoUrl, length = 'short') {
    try {
        // timestamp
        const timestamp = Date.now();
        const outputFolder = './server/output';
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
        }

        //const audioPath = await convertVideoToMp3(videoUrl, `audio-${timestamp}`);
        //const transcription = await transcribeAudio(audioPath);

        // delete audio file    
        //await fs.unlink(audioPath);


        // read sample transcription file to save api calls
        const transcribtFile = `./test_data/transcription-123.txt`;
        const transcription = await readTextFile(`${transcribtFile}`);
        const outputTranscription = `${outputFolder}/transcription-${timestamp}.txt`;
        await writeTextFile(outputTranscription, transcription);

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