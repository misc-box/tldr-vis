import { Stream } from "form-data";
import processVideo from "../src/processVideo";
import fs from "fs/promises";
import path from "path";
// @ts-ignore
import saveAsPDF from "../src/saveSummaryToPDF";
import { serverSupabaseClient } from '#supabase/server'
import extractTopics from "../src/extractTopics";
import saveSummaryToPDF from "../src/saveSummaryToPDF";
import summarizeTranscription from "../src/summarizeTranscription";
import readTextFile from "../src/readTextFile";
import writeTextFile from "../src/writeTextFile";
import transcribeAudio from "../src/transcribeAudio";
import convertVideoToMp3 from "../src/convertVideoToMp3";

async function stream2buffer(stream: Stream): Promise<Buffer> {

    return new Promise((resolve, reject) => {

        let buffer: any[] = [];

        stream.on("data", chunk => buffer.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(buffer)));
        stream.on("error", err => reject(`error converting stream - ${err}`));

    });
}

async function setLoadingStatus(client: any, videoUrl: string, status: string): Promise<void> {

    // @ts-ignore
    const { error } = await client.from("global_summaries").update([
        {
            id: btoa(new URL(videoUrl).pathname),
            video: null,
            transcript: null,
            result: { loading: true, info: status },
        }
    ]).eq('id', btoa(new URL(videoUrl).pathname))


    if (error) {
        console.log("COULD NOT WRITE TO DB WTF BRO??????")
        console.log(error.message)
    }
}

export default defineEventHandler(event => {
    return new Promise<string>(async r => {
        const { length, videoUrl } = await readBody(event);

        r(btoa(new URL(videoUrl).pathname));

        const client = await serverSupabaseClient(event)

        // @ts-ignore
        const { error } = await client.from("global_summaries").insert([
            {
                id: btoa(new URL(videoUrl).pathname),
                video: null,
                transcript: null,
                result: { loading: true, info: 'Starting ... (1/8)' },
            }
        ])


        if (error) {
            // already in database
            return;
        }

        try {
            // timestamp
            const timestamp = Date.now();
            let current = timestamp;
            const outputFolder = './server/output';
            if ((await fs.stat(outputFolder)) === null) {
                await fs.mkdir(outputFolder);
            }
            let transcription, outputTranscription;

            // TODO: Check if video link is valid
            // TODO: Check if video was already processed
            setLoadingStatus(client, videoUrl, 'Converting to `.mp3` ... (2/8)');
            const audioPath = await convertVideoToMp3(videoUrl, `audio-${timestamp}`);


            console.log('Needed time in seconds to convert video to audio:', (Date.now() - current) / 1000);
            current = Date.now();

            setLoadingStatus(client, videoUrl, 'Transcribing Audio ... (3/8)');
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
            setLoadingStatus(client, videoUrl, 'Saving Transcription ... (4/8)');
            await writeTextFile(outputTranscription, transcription);


            setLoadingStatus(client, videoUrl, 'Summarizing ... (5/8)');

            const summary = await summarizeTranscription(transcription, length);
            setLoadingStatus(client, videoUrl, 'Saving Summary ... (6/8)');
            const pdfSummary = await saveSummaryToPDF(summary, `${outputFolder}/summary-${timestamp}`);
            console.log('Needed time in seconds to summarize transcription:', (Date.now() - current) / 1000);
            current = Date.now();

            setLoadingStatus(client, videoUrl, 'Extracting Topics ... (7/8)');
            // extract topics
            const topics = await extractTopics(transcription);
            console.log('Needed time in seconds to extract topics:', (Date.now() - current) / 1000);
            current = Date.now();

            // Log the needed time in seconds to the console
            console.log('Needed time in seconds to process video:', (Date.now() - timestamp) / 1000);
            // Log the extracted topics to the console
            let result = { pdfPath: pdfSummary, transcriptionPath: outputTranscription, topics: topics }



            setLoadingStatus(client, videoUrl, 'Saving As Pdf ... (8/8)');

            console.log(result.pdfPath);

            const summaryBuffer = await fs.readFile(result.pdfPath);

            const transcriptTextBuffer = await fs.readFile(result.transcriptionPath, 'utf-8');

            await saveAsPDF(transcriptTextBuffer, result.transcriptionPath + "-tmp")

            const transcriptBuffer = await fs.readFile(path.resolve(result.transcriptionPath + "-tmp.pdf"));

            const newRes = {
                ...result,
                summaryBuf: summaryBuffer.toString('base64'),
                transcriptBuf: transcriptBuffer.toString('base64'),
            }

            // @ts-ignore
            const { error2 } = await client.from("global_summaries").update([
                {
                    id: btoa(new URL(videoUrl).pathname),
                    video: videoUrl,
                    transcript: transcriptTextBuffer,
                    result: newRes,
                }
            ]).eq("id", btoa(new URL(videoUrl).pathname))

            if (error2) {
                console.log("COULD NOT WRITE TO DB WTF BRO??????")
                console.log(error2.message)
            }
        } catch (error) {
            console.error('Error in processing video:', error.message);
            throw error;
        }
    });
});