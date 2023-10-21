require('dotenv').config();

const { parse } = require('node-html-parser');

const BASE_URL = 'https://video.ethz.ch/';

async function get_token(username: string, password: string): Promise<string> {
    const body = new FormData();
    body.set('_charset_', 'utf-8');
    body.set('j_username', username);
    body.set('j_password', password);
    body.set('j_validate', 'true');

    let res = await fetch('https://video.ethz.ch/lectures/d-infk/2023/autumn/263-5210-00L/j_security_check', { method: 'POST', body })
    let cookies = res.headers.getSetCookie().join(';');

    return cookies;
}

function lecture_id_by_path(path: string): string {
    return path.split('/').at(-1)?.split('.')[0];
}

async function get_lecture_links(query: string, offset: Number = 0): Promise<string[]> {
    let url = new URL('https://video.ethz.ch/search-results.html');
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('query', query);

    let res = await fetch(url);
    let text = await res.text();

    let html = parse(text);

    let video_links = html
        .querySelectorAll('#contentMain > div.results.searchresults.basecomponent > div:nth-child(3) > div > div.info > a')
        .map((h: HTMLElement) => h.getAttribute('href') || '');

    return video_links;
}

type Lecture = { name: string, date: Date, lecturer: string, link: URL, other_ids: string[] };

async function video_link_by_lecture_id(path: string, cookies?: string): Promise<Lecture> {
    let id = '0'; //can be anything as long as not an empty string
    let path_prefix = path.split('/').slice(0, -1).join('/');
    let video_url = new URL(`${path_prefix}/${id}.series-metadata.json`, BASE_URL);
    let res = await fetch(video_url, { headers: { cookie: cookies } });
    let json = await res.json();

    if (!json['authorized']) console.log('Not authorized: ' + JSON.stringify(json, null, 4));

    let selected = json['selectedEpisode'];
    let name = selected['title'];
    let lecturer = selected['createdBy'].join(', ');
    let date = new Date(selected['createdAt']);
    let presentations: { height: number, width: number, type: string, url: string }[] = selected['media']['presentations'];
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
    let other_ids = json['episodes'].map((e: { id: string }) => e.id);

    return { name: name, lecturer: lecturer, date: date, link: links[0].link, other_ids: other_ids };
}

async function main() {
    console.log(await video_link_by_lecture_id((await get_lecture_links('probabilistic artificial'))[2], await get_token(process.env.ETH_USERNAME, process.env.ETH_PASSWORD)));
}

Promise.resolve(main());
