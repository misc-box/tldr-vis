import processVideo from '../src/processVideo.js';
// 1 hour video
const videoUrl = 'https://oc-vp-dist-downloads.ethz.ch/mh_default_org/oaipmh-mmp/8cddd89f-23a0-412e-991f-5a2c7870bae2/c257e8e5-975a-4fbb-9cd3-fe136afdff2f/Lecture_10_Video_teaching_part_1.mp4'
//const videoUrl = 'https://oc-vp-dist-downloads.ethz.ch/mh_default_org/oaipmh-mmp/37a9988d-c608-4d33-bef0-3839225e0efb/0274c1e4-f48a-4288-9425-cc5d53e0d76b/20230623_1500_HGF1_Computation_Journalism_Conference2023_Bisiani.mp4';
processVideo(videoUrl, 'long')
    .then(({ pdfPath, transcriptionPath, topics }) => {
        console.log('pdfPath:', pdfPath);
        console.log('pdfTranscription:', transcriptionPath);
        console.log('topics:', topics);

    })
