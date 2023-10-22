import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)

        const body = await readBody(event)
        const {video_id: videoId} = body
        const user = await client.auth.getUser()

        const videoTopics = await handleGetVideoTopics(videoId, client)
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {video_topics: videoTopics},
        }
    }
    
    catch(error: any) {
        return {
            statusCode: 500,
            headers: {
                'content-type': 'application/json',
            },
            body: {message: error.message},
        }
    }
  })


async function handleGetVideoTopics(videoId: number, client: any) {
    const {data: videoTopics, error} = await client
        .from('video_topics')
        .select('video_topics.params')
        .join('videos', {on: {'video_topics.video_id': 'video.id'}})
        .eq('video.id', videoId)
    if(error) {
        throw new Error('handleGetVideoTopics() error ' + error.message)
    }
    return videoTopics
}