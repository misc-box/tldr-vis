import convertVideoToMp3 from '../src/convertVideoToMp3.js';

(async () => {
    try {
        const videoUrl1 = 'https://oc-vp-distribution04.ethz.ch/mh_default_org/oaipmh-mmp/28c9cd03-8651-4212-863c-53caaffc3101/8fbc0be9-f5f4-4324-b1a8-433f699f839a/presentation-5961901f-6802-49a7-b7bb-235c3a2f52e7.mp4';
        await convertVideoToMp3(videoUrl1);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
