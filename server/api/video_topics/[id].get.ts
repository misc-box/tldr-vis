import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)
        const user = await client.auth.getUser()

        const id = event.context.params.id
        const video_topic = await handleVideoTopicRetrieval(client, id)
        

        if(video_topic.length == 0){
            return {
                statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                },
                body: {message: 'Video topic not found'},
            }
        }

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {video_topic: video_topic[0]},
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

async function handleVideoTopicRetrieval(client: any, id: string) {
    const {data: video_topic, error} = await client
        .from('video_topics')
        .select('*')
        .eq('id', id)
    if(error) {
        throw new Error('handleVideoTopicRetrieval() error ' + error.message)
    }
    return video_topic
}