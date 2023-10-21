import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    
    try{
        const client = await serverSuperbaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.user()

        const topic = await handleTopicRetrieval(client, body)

        if(topic.length == 0){
            return {
                statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify('Topic not found'),
            }
        }

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(topic[0]),
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

async function handleTopicRetrieval(client: serverSuperbaseClient, body: any) {
    const {data: topic, error} = await client
        .from('topics')
        .select('*')
        .eq('id', body.pathParameters.id)
    if(error) {
        throw new Error('handleTopicRetrieval() error ' + error)
    }
    return topic
}
