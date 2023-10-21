const { parse } = require('node-html-parser');

const BASE_URL = 'https://video.ethz.ch/';

async function get_lecture_links(query: string, offset: Number = 0): Promise<string[]> {
    let url = new URL('https://video.ethz.ch/search-results.html');
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('query', query);

    let res = await fetch(url);
    let text = await res.text();

    let html = parse(text);

    let video_links = html
        .querySelectorAll('#contentMain > div.results.searchresults.basecomponent > div:nth-child(3) > div > div.info > a')
        .map((h: HTMLElement) => h.getAttribute('href') || '')
        .map((u: string) => u.split('/').at(-1)?.split('.')[0]);

    return video_links;
}

type Lecture = { name: string, date: Date, lecturer: string, link: URL };

async function video_link_by_lecture(lecture_id: string): Promise<Lecture> {
    let video_url = new URL('/lectures/d-gess/2020/autumn/851-0171-00L/${lecture_id}.series-metadata.json', BASE_URL);
    let res = await fetch(video_url);
    let json = (await res.json())['selectedEpisode'];

    let name = json['title'];
    let lecturer = json['createdBy'].join(', ');
    let date = new Date(json['createdAt']);
    let presentations: { height: number, width: number, type: string, url: string }[] = json['media']['presentations'];
    let links = presentations.filter(p => {
        if (p.type === 'video/mp4') {
            return true;
        } else {
            // also mp3?
            console.log(p.type);
            return false;
        }
    }).map(p => ({ resolution: p.width * p.height, link: new URL(p.url) }));
    links.sort((v1, v2) => v1.resolution - v2.resolution);

    return { name: name, lecturer: lecturer, date: date, link: links[0].link };
}

async function main() {
    console.log(await video_link_by_lecture((await get_lecture_links('mathematics', 20))[0]));
}

Promise.resolve(main());
