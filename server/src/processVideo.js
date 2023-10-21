

import saveSummaryToPDF from './saveSummaryToPDF.js';
// Import the functions
import fs from 'fs';
// Import the functions
import readTextFile from './readTextFile.js';
import writeTextFile from './writeTextFile.js';

async function processVideo(videoUrl, length = 'short') {
    try {
        // timestamp
        const timestamp = Date.now();

        //const audioPath = await convertVideoToMp3(videoUrl, `audio-${timestamp}`);
        //const transcription = await transcribeAudio(audioPath);
        // delete audio file    
        //await fs.unlink(audioPath);
        const outputFolder = './server/output';
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
        }

        // read sample transcription file
        const trasncriptFile = `${outputFolder}/transcription-1697852161179.txt`;
        const transcription = await readTextFile(`${trasncriptFile}`);

        //const summary = await summarizeTranscription(transcription, length);
        const 
        const summary = 'summary';
        const pdfSummary = saveSummaryToPDF(summary, `${outputFolder}/summary-${timestamp}`);

        const outputTranscription = `${outputFolder}/transcription-${timestamp}.txt`;
        await writeTextFile(outputTranscription, transcription);

        return { pdfPath: pdfSummary, pdfTranscription: outputTranscription }
    } catch (error) {
        console.error('Error in processing video:', error.message);
        throw error;
    }
}



export default processVideo;