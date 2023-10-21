

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
async function processVideo(videoUrl, summaryId, length = 'short', type = 'text', mock = false) {
    try {
        const client = await serverSuperbaseClient(event)
        // timestamp
        const timestamp = Date.now();
        let current = timestamp;
        const outputFolder = './server/output';
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
        }
        let transcription, outputTranscription;

        // mock to save api calls
        if (!mock) {
            // TODO: Check if video link is valid
            // TODO: Check if video was already processed
            const audioPath = await convertVideoToMp3(videoUrl, `audio-${timestamp}`);
            
            //update status of summary
            await client.from('summaries').update({ status: 'mp3_converted' }).match({ id: summaryId });

            console.log('Needed time in seconds to convert video to audio:', (Date.now() - current) / 1000);
            current = Date.now();
            
            transcription = await transcribeAudio(audioPath);
            console.log('Needed time in seconds to transcribe audio:', (Date.now() - current) / 1000);
            current = Date.now();

            //update status of summary
            await client.from('summaries').update({ status: 'transcribed' }).match({ id: summaryId });

            // delete audio file    
            try {
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

        const summary = await summarizeTranscription(transcription, length, type);
        const pdfSummary = saveSummaryToPDF(summary, `${outputFolder}/summary-${timestamp}`);
        console.log('Needed time in seconds to summarize transcription:', (Date.now() - current) / 1000);
        current = Date.now();

        // extract topics
        const topics = await extractTopics(transcription);
        console.log('Needed time in seconds to extract topics:', (Date.now() - current) / 1000);
        current = Date.now();

        // Log the needed time in seconds to the console
        console.log('Needed time in seconds to process video:', (Date.now() - timestamp) / 1000);

        //update status of summary
        await client.from('summaries').update({ status: 'finished' }).match({ id: summaryId });

        // Log the extracted topics to the console
        return { pdfPath: pdfSummary, transcriptionPath: outputTranscription, topics: topics }
    } catch (error) {
        console.error('Error in processing video:', error.message);
        throw error;
    }
}



export default processVideo;