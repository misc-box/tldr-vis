import processVideo from '../src/processVideo.js';

// Probabilistic Artificial intelligence  - Krause - 2023 - 1:31:00
const videoUrl = 'https://oc-vp-dist-downloads.ethz.ch/mh_default_org/oaipmh-mmp/7627c5e1-06ab-4a1c-9fb1-1e214b1b9be0/2e829049-33fd-488b-aa74-246d74a5b78b/presentation-398e2f4a-d209-4b68-98e3-dca831febdce.mp4';
processVideo(videoUrl, 'short')
    .then(({ pdfPath, transcriptionPath, topics }) => {
        console.log('pdfPath:', pdfPath);
        console.log('pdfTranscription:', transcriptionPath);
        console.log('topics:', topics);

    })
