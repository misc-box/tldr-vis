import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path'; // Import the path module here

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function convertVideoToMp3(videoUrl, name) {
    return new Promise((resolve, reject) => {
        const audioDir = path.join('tmp', name);
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }
        const outputPath = path.join(tempDir, `${name}.mp3`);
        console.log('outputPath:', outputPath);
        ffmpeg(videoUrl)
            .format('mp3')
            .audioBitrate('64k')
            .outputOptions([
                '-f segment',
                '-segment_time 3600',
                '-reset_timestamps 1',
            ])
            .on('error', reject)
            .on('end', () => resolve(audioDir))
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
