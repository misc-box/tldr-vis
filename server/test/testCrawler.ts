import {get_duration_by_url, get_lecture_by_url} from '../src/crawler';

function assert<T>(actual: T, expected: T) {
    if (actual !== expected) throw 'Expected `' + expected + '`, found `' + actual + '`';
}

(async () => {
    try {
        const videoUrl = new URL('https://oc-vp-distribution04.ethz.ch/mh_default_org/oaipmh-mmp/28c9cd03-8651-4212-863c-53caaffc3101/8fbc0be9-f5f4-4324-b1a8-433f699f839a/presentation-5961901f-6802-49a7-b7bb-235c3a2f52e7.mp4');
        
        assert(await get_duration_by_url(videoUrl), 44 * 60 + 1);
        assert((await get_lecture_by_url('https://video.ethz.ch/speakers/lecture/f7ada957-8b2b-45b3-84cf-77d2991b28ea.html')).link.toString(), 'https://oc-vp-dist-downloads.ethz.ch/mh_default_org/oaipmh-mmp/f7ada957-8b2b-45b3-84cf-77d2991b28ea/20d0b39e-47f1-487e-a418-b79992a6fc45/20231010_HGF30_EV_Wang.mp4');
    } catch (error: any) {
        console.error('Error:', error);
    }
})();
