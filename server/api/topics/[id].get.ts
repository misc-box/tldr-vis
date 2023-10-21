import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)
    const body = await readBody(event)

    const user = await client.auth.user()

    const {data: topic, error} = await client
        .from('topics')
        .select('*')
        .eq('id', body.pathParameters.id)
    
    if(topic.length == 0){
        return {
            statusCode: 404,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({message: 'Topic not found'}),
        }
    }

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: topic,
    }
  })