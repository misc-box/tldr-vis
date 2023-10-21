import processVideo from '../src/processVideo.js';

const videoUrl = 'https://oc-vp-dist-downloads.ethz.ch/mh_default_org/oaipmh-mmp/37a9988d-c608-4d33-bef0-3839225e0efb/0274c1e4-f48a-4288-9425-cc5d53e0d76b/20230623_1500_HGF1_Computation_Journalism_Conference2023_Bisiani.mp4';
processVideo(videoUrl)
    .then(({ pdfPath, transcription }) => {
        console.log('PDF path:', pdfPath);
        console.log('Transcription:', transcription);
    })