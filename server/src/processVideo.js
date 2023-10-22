

import { promises as fs } from 'fs';
import saveSummaryToPDF from './processText/saveSummaryToPDF.js';
// Import the functions
import convertVideoToMp3 from './convertVideoToMp3.js';
import extractTopics from './processText/extractTopics.js';
import readTextFile from './processText/readTextFile.js';
import summarizeTranscription from './processText/summarizeText.js';
import writeTextFile from './processText/writeTextFile.js';
import transcribeAudio from './transcribeAudio.js';
async function processVideo(videoUrl, length = 'short', mock = false) {
    try {
        // timestamp
        const timestamp = Date.now();
        let current = timestamp;
        const outputFolder = './server/output';
        if ((await fs.stat(outputFolder)) === null) {
            await fs.mkdir(outputFolder);
        }
        let transcription, outputTranscription;

        // mock to save api calls
        if (!mock) {
            // TODO: Check if video link is valid
            // TODO: Check if video was already processed
            const audioPath = await convertVideoToMp3(videoUrl, `audio-${timestamp}`);


            console.log('Needed time in seconds to convert video to audio:', (Date.now() - current) / 1000);
            current = Date.now();

            transcription = await transcribeAudio(audioPath);
            console.log('Needed time in seconds to transcribe audio:', (Date.now() - current) / 1000);
            current = Date.now();

            // delete audio file    
            try {
                await fs.unlink(audioPath);
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
        const pdfSummary = await saveSummaryToPDF(summary, `${outputFolder}/summary-${timestamp}`);
        console.log('Needed time in seconds to summarize transcription:', (Date.now() - current) / 1000);
        current = Date.now();

        // extract topics
        const topics = await extractTopics(transcription);
        console.log('Needed time in seconds to extract topics:', (Date.now() - current) / 1000);
        current = Date.now();

        // Log the needed time in seconds to the console
        console.log('Needed time in seconds to process video:', (Date.now() - timestamp) / 1000);
        // Log the extracted topics to the console
        return { pdfPath: pdfSummary, transcriptionPath: outputTranscription, topics: topics }
    } catch (error) {
        console.error('Error in processing video:', error.message);
        throw error;
    }
}



export default processVideo;