import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path'; // Import the path module here
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);


const tempDir = path.join('.', 'tmp');

async function convertVideoToMp3(videoUrl, name) {
    return new Promise((resolve, reject) => {
        const timestamp = Date.now();
        //create temp directory if it doesn't exist
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        const outputPath = path.join(tempDir, `${name}.mp3`);

        ffmpeg(videoUrl)
            .format('mp3')
            .on('error', reject)
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
}

export default convertVideoToMp3;
