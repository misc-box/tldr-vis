import { Stream } from "form-data";
import processVideo from "../src/processVideo";
import fs from "fs";
import path from "path";
// @ts-ignore
import PDFKit from "pdfkit";
import saveAsPDF from "../src/saveSummaryToPDF";
import { randomUUID } from "crypto";
import os from "os";

function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}


async function stream2buffer(stream: Stream): Promise<Buffer> {

    return new Promise < Buffer > ((resolve, reject) => {
        
        const _buf = Array < any > ();

        stream.on("data", chunk => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", err => reject(`error converting stream - ${err}`));

    });
} 


export default defineEventHandler(async event => {
    const { length, videoUrl } = await readBody(event);
    
    const result = await processVideo(videoUrl, length);

    console.log(result.pdfPath);
    
    const summaryBuffer = fs.readFileSync(result.pdfPath);

    const transcriptTextBuffer = fs.readFileSync(result.transcriptionPath, 'utf-8');

    await saveAsPDF(transcriptTextBuffer, result.transcriptionPath + "-tmp")

    const transcriptBuffer = fs.readFileSync(path.resolve(result.transcriptionPath + "-tmp.pdf"));

    console.log('Boeffeur')

    const newRes = {
        ...result,
        summaryBuf: summaryBuffer.toString('base64'),
        transcriptBuf: transcriptBuffer.toString('base64'),
    }

    return newRes;
});