import { Stream } from "form-data";
import fs from "fs/promises";
import path from "path";
import processVideo from "../src/processVideo";
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

        let buffer = [];

        let buffer: any[] = [];

        stream.on("data", chunk => buffer.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(buffer)));
        stream.on("error", err => reject(`error converting stream - ${err}`));

    });
}


export default defineEventHandler(async event => {
    const { length, videoUrl } = await readBody(event);

    const result = await processVideo(videoUrl, length);

    console.log(result.pdfPath);

    const summaryBuffer = await fs.readFile(result.pdfPath);
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