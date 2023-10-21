import processVideo from "../src/processVideo";

export default defineEventHandler(async event => {
    const { length, videoUrl } = await readBody(event);
    
    return await processVideo(videoUrl, length);
});