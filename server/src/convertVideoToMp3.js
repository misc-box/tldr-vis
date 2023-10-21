import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import os from "os";

ffmpeg.setFfmpegPath(ffmpegPath.path);

import path, { dirname } from 'path'; // Import the path module here

async function convertVideoToMp3(videoUrl, name) {
    return new Promise((resolve, reject) => {
        const timestamp = Date.now();
        const outputPath = path.join(os.tmpdir(), `${name}.mp3`);

        ffmpeg(videoUrl)
            .format('mp3')
            .on('error', reject)
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
}

export default convertVideoToMp3;
