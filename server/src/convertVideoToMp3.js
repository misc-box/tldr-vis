import ffmpeg from 'fluent-ffmpeg';
<<<<<<< HEAD
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import os from "os";

ffmpeg.setFfmpegPath(ffmpegPath.path);

import path, { dirname } from 'path'; // Import the path module here
=======
import fs from 'fs';
import path from 'path'; // Import the path module here
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);


const tempDir = path.join('.', 'tmp');
>>>>>>> 1367f8895599112433229d049e8cb7a8f06bb7dd

async function convertVideoToMp3(videoUrl, name) {
    return new Promise((resolve, reject) => {
        const timestamp = Date.now();
<<<<<<< HEAD
        const outputPath = path.join(os.tmpdir(), `${name}.mp3`);
=======
        //create temp directory if it doesn't exist
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        const outputPath = path.join(tempDir, `${name}.mp3`);
>>>>>>> 1367f8895599112433229d049e8cb7a8f06bb7dd

        ffmpeg(videoUrl)
            .format('mp3')
            .on('error', reject)
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
}

export default convertVideoToMp3;
