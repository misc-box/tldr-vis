


import fs from 'fs/promises';
import convertVideoToMp3 from './convertVideoToMp3.js';
import saveSummaryToPDF from './saveSummaryToPDF.js';
import summarizeTranscription from './summarizeTranscription.js';
import transcribeAudio from './transcribeAudio.js';

async function processVideo(videoUrl, length = 'short') {
    try {
        // timestamp
        const timestamp = Date.now();

        const audioPath = await convertVideoToMp3(videoUrl, `audio-${timestamp}`);
        const transcription = await transcribeAudio(audioPath);
        // delete audio file    
        await fs.unlink(audioPath);
        
        const summary = await summarizeTranscription(transcription, length);
        const pdfSummary = saveSummaryToPDF(summary, `summary-${timestamp}`);
        const pdfTranscription = saveSummaryToPDF(transcription, `transcription-${timestamp}`);
        return { pdfPath: pdfSummary, pdfTranscriptionPath: pdfTranscription }
    } catch (error) {
        console.error('Error in processing video:', error.message);
        throw error;
    }
}


export default processVideo;