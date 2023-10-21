import ffmpeg from 'fluent-ffmpeg';
import path, { dirname } from 'path'; // Import the path module here
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tempDir = path.join(__dirname, 'tmp');

async function convertVideoToMp3(videoUrl, name) {
    return new Promise((resolve, reject) => {
        const timestamp = Date.now();
        const outputPath = path.join(tempDir, `${name}.mp3`);

        ffmpeg(videoUrl)
            .format('mp3')
            .on('error', reject)
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
}

export default convertVideoToMp3;
