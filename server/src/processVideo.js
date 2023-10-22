

import saveSummaryToPDF from './saveSummaryToPDF.js';
import { promises as fs } from 'fs';
// Import the functions
import convertVideoToMp3 from './convertVideoToMp3.js';
import extractTopics from './extractTopics.js';
import readTextFile from './readTextFile.js';
import summarizeTranscription from './summarizeTranscription.js';
import transcribeAudio from './transcribeAudio.js';
import writeTextFile from './writeTextFile.js';
import path from 'path';
async function processVideo(videoUrl, length = 'short', mock = false) {
    try {
        // timestamp
        const timestamp = Date.now();
        let current = timestamp;

        const path = './server/output';

        try {
            await fs.access(path)
        } catch (e) {
            // Creating new: 
            console.log('create directory')
            fs.mkdirSync(path, { recursive: true });
        }

        // Check if the folder exists
        if (!fs.existsSync(path)) {
            // If it doesn't exist, create it
            try {
            } catch (err) {
                console.error('Error creating the folder:', err);
            }
        } else {
            console.log('Folder already exists');
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