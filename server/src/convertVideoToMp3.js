import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path'; // Import the path module here

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

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
        console.log('outputPath:', outputPath);
        ffmpeg(videoUrl)
            .format('mp3')
            .on('error', reject)
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
}
async function splitMp3(audioPath) {
    return new Promise((resolve, reject) => {
        const timestamp = Date.now();
        const audioDir = path.join(tempDir, `audio-${timestamp}`);  // Directory for audio segments
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir);
        }
        const outputPath = path.join(audioDir, 'segment-%03d.mp3');  // Output path template

        ffmpeg(audioPath)
            .outputOptions([
                '-f segment',
                '-segment_time 1800',
                '-c copy',
                '-map 0',
                '-segment_format mp3',
                '-reset_timestamps 1',
                '-y',
            ])
            .on('error', reject)
            .on('end', () => resolve(audioDir))  // Return the directory path, not the filename template
            .save(outputPath);
    });
}


export default convertVideoToMp3;
export { splitMp3 };
