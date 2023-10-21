require('dotenv').config();

const { parse } = require('node-html-parser');
const fs = require('fs');
const moment = require('moment');

const BASE_URL = 'https://video.ethz.ch/';

async function get_cookies(username: string, password: string): Promise<string> {
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

async function get_lecture_links_by_query_offset(query: string, offset: Number = 0): Promise<string[]> {
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

type Lecture = { name: string, date: Date, lecturer: string, link: URL, duration: number };

/// path should be the path of the url in the url box (without the base) or the whole url
///
/// sends cookie if given, some lectures are 'protected'
async function get_video_link_by_lecture_id(path: string, cookies?: string): Promise<Lecture> {
    let id = '0'; //can be anything as long as not an empty string
    let path_prefix = path.split('/').slice(0, -1).join('/');
    let video_url = new URL(`${path_prefix}/${id}.series-metadata.json`, BASE_URL);
    let res = await fetch(video_url, { headers: { cookie: cookies } });
    let json;
    try {
        json = await res.json();
    } catch (e) {
        // "invalid" lecture (html doesn't exist too, e. g. /lectures/d-math/2019/autumn/401-0261-g0l/0c1c661c-bbf4-4899-9c40-7aa1e2483c5b.html)
        return null;
    }

    if (json['protection'] === 'PWD' || !json['authorized']) {
        // console.log('Not authorized: ' + JSON.stringify(json, null, 4));
        return null;
    }


    let selected = json['selectedEpisode'];
    let name = selected['title'];
    let lecturer = selected['createdBy'].join(', ');
    let date = new Date(selected['createdAt']);
    let presentations: { height: number, width: number, type: string, url: string }[] = selected['media']['presentations'] ?? selected['media']['presenters'];
    let links = presentations.filter(p => p.type === 'video/mp4').map(p => ({ resolution: p.width * p.height, link: new URL(p.url) }));
    links.sort((v1, v2) => v1.resolution - v2.resolution);
    let other_ids = json['episodes'].map((e: { id: string }) => e.id);

    // e.g. on podcasts there are `.mp4`
    if (links.length === 0) return null;

    return { name: name, lecturer: lecturer, date: date, link: links[0].link, duration: moment.duration(selected['duration']).asMilliseconds() };
}

/// the question mark (`?`) seems to return all lectures
async function get_lecture_links_by_query(query: string): Promise<string[]> {
    let url = new URL('https://video.ethz.ch/search-results.html');
    url.searchParams.append('query', query);

    let res = await fetch(url);
    let text = await res.text();

    let html = parse(text);

    let hits = parseInt(html.querySelector('#contentMain > div.results.searchresults.basecomponent > div.newsList.video.results > div > span').text.split(' '));

    let left = hits;

    let processes = [];
    let links = [];

    console.log('Hits: ' + hits);
    while (left > 0) {
        processes.push(get_lecture_links_by_query_offset(query, hits - left));

        left -= 20;

        if (processes.length == 20) {
            let promises = await Promise.all(processes);
            links.push(...promises.flatMap(m => m));
            processes.length = 0;

            console.log((hits - left) + '/' + hits);
        }
    }

    return links;
}
async function main() {
    console.time();
    // let links = await get_lecture_links_by_query('?');
    // let links = [
    //     'https://video.ethz.ch/lectures/d-itet/2023/spring/227-0395-00L/dbbaf3d3-9fd7-4e34-9e5a-c6de79695cfc.html',
    //     'https://video.ethz.ch/lectures/d-infk/2017/autumn/252-0027-00L/c5ede336-1102-4ff8-bcc4-ad1a294a5252.html',
    //     'https://video.ethz.ch/lectures/d-math/2021/spring/401-1262-07L/551ccb9d-669e-4568-8d80-635a6a969ce5.html',
    //     'https://video.ethz.ch/events/2019/rsl/83f9587c-82ea-43ab-94c4-ad2a78fc7dac.html'
    // ];
    let links = JSON.parse(fs.readFileSync('links.json'));

    let processes = [];
    let video_links: Lecture[] = JSON.parse(fs.readFileSync('video-links.json'));
    if (process.env.ETH_USERNAME === undefined || process.env.ETH_PASSWORD === undefined) console.warn('No credentials, only downloading unprotected videos.');
    let cookies = await get_cookies(process.env.ETH_USERNAME, process.env.ETH_PASSWORD);

    // video_links.sort((a, b) => a.duration - b.duration);

    // fs.writeFileSync('video-links.json', JSON.stringify(video_links.filter(l => l !== null)));

    // throw '';

    let left = links.length - video_links.length;
    console.log('Total: ' + left);
    while (left > 0) {
        processes.push(get_video_link_by_lecture_id(links.at(-left), cookies));

        left--;

        if (processes.length == 500) {
            let promises = await Promise.all(processes);
            video_links.push(...promises);
            processes.length = 0;

            fs.writeFileSync('video-links.json', JSON.stringify(video_links));

            console.log((links.length - left) + '/' + links.length);
        }
    }
    // let videos = await Promise.all(links.map(async l => await video_link_by_lecture_id(l, await get_cookies(process.env.ETH_USERNAME, process.env.ETH_PASSWORD))));
    console.timeEnd();
    video_links.sort((a, b) => a.duration - b.duration);
    fs.writeFileSync('video-links.json', JSON.stringify(video_links.filter(l => l !== null)));
}

console.log('start');
Promise.resolve(main());
