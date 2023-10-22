import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function convertVideoToMp3(videoUrl, name) {
    return new Promise((resolve, reject) => {
        const audioDir = path.join('tmp', name);
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }
        const outputPath = path.join(audioDir, "Audio" + '-%03d.mp3');

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

export default convertVideoToMp3;
