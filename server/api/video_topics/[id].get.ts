import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)
        const body = await readBody(event)
        const user = await client.auth.user()

        const video_topic = await handleVideoTopicRetrieval(client, body)
        
        if(video_topic.length == 0){
            return {
                statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({'Video topic not found'}),
            }
        }

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(video_topic[0]),
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

async function handleVideoTopicRetrieval(client: serverSuperbaseClient, body: any) {
    const {data: video_topic, error} = await client
        .from('video_topics')
        .select('*')
        .eq('id', body.pathParameters.id)
    if(error) {
        throw new Error('handleVideoTopicRetrieval() error ' + error)
    }
    return video_topic
}