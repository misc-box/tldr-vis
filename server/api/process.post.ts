import { Stream } from "form-data";
import processVideo from "../src/processVideo";
import fs from "fs/promises";
import path from "path";
// @ts-ignore
import PDFKit from "pdfkit";
import saveAsPDF from "../src/processText/saveSummaryToPDF";
import { serverSupabaseClient } from '#supabase/server'
import extractTopics from "../src/processText/extractTopics";
import saveSummaryToPDF from "../src/processText/saveSummaryToPDF";
import summarizeTranscription from "../src/processText/summarizeTranscription";
import readTextFile from "../src/processText/readTextFile";
import writeTextFile from "../src/processText/writeTextFile";
import { transcribeAudio } from "../src/transcribeAudio";
import convertVideoToMp3, { splitMp3 } from "../src/convertVideoToMp3";

function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}


async function stream2buffer(stream: Stream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        let buffer = [];

        stream.on("data", (chunk) => buffer.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(buffer)));
        stream.on("error", (err) => reject(`error converting stream - ${err}`));
    });
}

export default defineEventHandler((event) => {
    return new Promise<string>(async (r) => {
        const { length, videoUrl } = await readBody(event);

        const client = await serverSupabaseClient(event);

        // @ts-ignore
        const { error } = await client.from("global_summaries").insert([
            {
                id: btoa(new URL(videoUrl).pathname),
                video: null,
                transcript: null,
                result: { loading: true, info: "Starting ... (1/9)" },
            },
        ]);

        r(btoa(new URL(videoUrl).pathname));

        if (error) {
            // already in database
            return;
        }

        try {
            // timestamp
            const timestamp = Date.now();
            let current = timestamp;
            const outputFolder = "./server/output";
            if ((await fs.stat(outputFolder)) === null) {
                await fs.mkdir(outputFolder);
            }
            let transcription, outputTranscription;

            // TODO: Check if video link is valid
            // TODO: Check if video was already processed
            setLoadingStatus(client, videoUrl, "Converting to `.mp3` ... (2/9)");
            const audioPath = await convertVideoToMp3(videoUrl, `audio-${timestamp}`);

            console.log("Needed time in seconds to convert video to audio:", (Date.now() - current) / 1000);
            current = Date.now();

            // Split the MP3 file into segments
            console.log("Audio path:", audioPath); // Log the audio path for debugging

            console.log("Starting to split audio file");
            setLoadingStatus(client, videoUrl, "Splitting `.mp3` ... (3/9)");
            const segmentsDir = await splitMp3(audioPath);
            console.log("Segments directory:", segmentsDir); // Log the segments directory for debugging

            // Transcribe the audio segments
            console.log("Starting to transcribe audio segments");
            setLoadingStatus(client, videoUrl, "Transcribing Audio ... (4/9)");
            transcription = await transcribeAudio(segmentsDir);
            console.log("Transcription:", transcription); // Log the transcription for debugging
            console.log("Needed time in seconds to convert video to audio:", (Date.now() - current) / 1000);
            current = Date.now();

            outputTranscription = `${outputFolder}/transcription-${timestamp}.txt`;
            setLoadingStatus(client, videoUrl, "Saving Transcription... (5/9)");
            await writeTextFile(outputTranscription, transcription);

            // delete audio file
            try {
                await fs.rmdir(segmentsDir, { recursive: true });
            } catch (error) {
                console.error("Error in processing video:", error.message);
            }

            // setLoadingStatus(client, videoUrl, 'Transcribing Audio ... (3/8)');
            // transcription = await transcribeAudio(audioPath);
            // console.log('Needed time in seconds to transcribe audio:', (Date.now() - current) / 1000);
            // current = Date.now();

            setLoadingStatus(client, videoUrl, "Summarizing ... (6/9)");

            const summary = await summarizeTranscription(transcription, length);
            setLoadingStatus(client, videoUrl, "Saving Summary ... (7/9)");
            const pdfSummary = await saveSummaryToPDF(summary, `${outputFolder}/summary-${timestamp}`);
            console.log("Needed time in seconds to summarize transcription:", (Date.now() - current) / 1000);
            current = Date.now();

            setLoadingStatus(client, videoUrl, "Extracting Topics ... (8/9)");
            // extract topics
            const topics = await extractTopics(transcription);
            console.log("Needed time in seconds to extract topics:", (Date.now() - current) / 1000);
            current = Date.now();

            // Log the needed time in seconds to the console
            console.log("Needed time in seconds to process video:", (Date.now() - timestamp) / 1000);
            // Log the extracted topics to the console
            let result = { pdfPath: pdfSummary, transcriptionPath: outputTranscription, topics: topics };

            setLoadingStatus(client, videoUrl, "Saving As Pdf ... (9/9)");

            console.log(result.pdfPath);

            const summaryBuffer = await fs.readFile(result.pdfPath);

            const transcriptTextBuffer = await fs.readFile(result.transcriptionPath, "utf-8");

            await saveAsPDF(transcriptTextBuffer, result.transcriptionPath + "-tmp");

            const transcriptBuffer = await fs.readFile(path.resolve(result.transcriptionPath + "-tmp.pdf"));

            const newRes = {
                ...result,
                summaryBuf: summaryBuffer.toString("base64"),
                transcriptBuf: transcriptBuffer.toString("base64"),
            };

            // @ts-ignore
            const { error2 } = await client
                .from("global_summaries")
                .update([
                    {
                        id: btoa(new URL(videoUrl).pathname),
                        video: videoUrl,
                        transcript: transcriptTextBuffer,
                        result: newRes,
                    },
                ])
                .eq("id", btoa(new URL(videoUrl).pathname));

            if (error2) {
                console.log("COULD NOT WRITE TO DB WTF BRO??????");
                console.log(error2.message);
            }
        } catch (error) {
            console.error("Error in processing video:", error.message);
            throw error;
        }
    });
});
