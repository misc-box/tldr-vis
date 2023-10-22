import { Stream } from "form-data";
import fs from "fs/promises";
import path from "path";
import processVideo from "../src/processVideo";
// @ts-ignore

import saveAsPDF from "../src/processText/saveSummaryToPDF";


import { serverSupabaseClient } from '#supabase/server';

function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}


async function stream2buffer(stream: Stream): Promise<Buffer> {

    return new Promise((resolve, reject) => {

        let buffer = [];

        stream.on("data", chunk => buffer.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(buffer)));
        stream.on("error", err => reject(`error converting stream - ${err}`));

    });
}



export default defineEventHandler(async event => {
    const { length, videoUrl } = await readBody(event);

    const client = await serverSupabaseClient(event)

    const result = await processVideo(videoUrl, length);

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
    const { error } = await client.from("global_summaries").insert([
        {
            video: videoUrl,
            transcript: transcriptTextBuffer,
            result: newRes,
        }
    ])


    if (error) {
        console.log("COULD NOT WRITE TO DB WTF BRO??????")
        console.log(error.message)
    }

    return newRes;
});