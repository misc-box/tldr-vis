import ffprobe from 'ffprobe';
import { path as ffprobe_path } from '@ffprobe-installer/ffprobe';
import { duration } from 'moment';

const BASE_URL = 'https://video.ethz.ch/';

export async function get_duration_by_url(url: URL): Promise<number> {
    const data = await ffprobe(url, {path: ffprobe_path});

    return parseInt(data.streams[0].duration);
}

export type Lecture = { name: string, date: Date, lecturer: string, link: URL, duration: number };

/// path should be the path of the url in the url box (without the base) or the whole url
///
/// sends cookie if given, some lectures are 'protected'
export async function get_lecture_by_url(path: string, cookies?: string): Promise<Lecture> {
    const path_prefix = path.split('.').slice(0, -1).join('.');
    const video_url = new URL(`${path_prefix}.series-metadata.json`, BASE_URL);

    let res = await fetch(video_url, { headers: { cookie: cookies } });
    let json;
    try {
        json = await res.json();
    } catch (e) {
        // "invalid" lecture (html doesn't exist (404), e. g. /lectures/d-math/2019/autumn/401-0261-g0l/0c1c661c-bbf4-4899-9c40-7aa1e2483c5b.html)
        return null;
    }

    if (json.protection === 'PWD' || !json.authorized) {
        // password protected (special pwd)
        return null;
    }


    const selected = json.selectedEpisode;
    const name = selected.title;
    const lecturer = selected.createdBy.join(', ');
    const date = new Date(selected.createdAt);
    const presentations: { height: number, width: number, type: string, url: string }[] = selected.media.presentations ?? selected.media.presenters;
    let links = presentations.filter(p => p.type === 'video/mp4').map(p => ({ resolution: p.width * p.height, link: new URL(p.url) }));

    links.sort((v1, v2) => v1.resolution - v2.resolution);

    // e.g. on podcasts there are only `.mp3`
    if (links.length === 0) return null;

    return {
        name,
        lecturer,
        date,
        link: links[0].link,
        duration: Math.floor(duration(selected.duration).asMilliseconds() / 1000)
    };
}

export async function get_cookies(username: string, password: string): Promise<string> {
    let body = new FormData();
    body.set('_charset_', 'utf-8');
    body.set('j_username', username);
    body.set('j_password', password);
    body.set('j_validate', 'true');

    // could be any link
    let res = await fetch('https://video.ethz.ch/lectures/d-infk/2023/autumn/263-5210-00L/j_security_check', { method: 'POST', body })
    const cookies = res.headers.getSetCookie().join(';');

    return cookies;
}