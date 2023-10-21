import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)

        const body = await readBody(event)
        const {video_id: videoId} = JSON.parse(body)
        const user = await client.auth.user()

        const videoTopics = await handleGetVideoTopics(videoId, client)
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(videoTopics),
        }
    }
    
    catch(error) {
        return {
            statusCode: 500,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({message: 'Internal server error'}),
        }
    }
  })


async function handleGetVideoTopics(videoId: number, client: serverSuperbaseClient) {
    const {data: videoTopics, error} = await client
        .from('video_topics')
        .select('video_topics.params')
        .join('videos', {on: {'video_topics.video_id': 'video.id'}})
        .eq('video.id', videoId)
    if(error) {
        throw new Error('handleGetVideoTopics() error ' + error)
    }
    return videoTopics
}