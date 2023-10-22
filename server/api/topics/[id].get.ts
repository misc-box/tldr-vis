import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    
    try{
        const client = await serverSupabaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.getUser()
        
        const id = event.context.params.id
        const topic = await handleTopicRetrieval(client, id)
        
        if(topic.length == 0){
            return {
                statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                },
                body: {message: 'Topic not found'},
            }
        }

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {topic: topic[0]},
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

async function handleTopicRetrieval(client: any, id: string) {
    const {data: topic, error} = await client
        .from('topics')
        .select('*')
        .eq('id', id)
    if(error) {
        throw new Error('handleTopicRetrieval() error ' + error.message)
    }
    return topic
}
