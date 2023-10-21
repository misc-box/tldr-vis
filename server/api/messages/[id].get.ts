import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)
    const body = await readBody(event)

    const user = await client.auth.user()

    const {data: message, error} = await client
        .from('summaries')
        .select('*')
        .eq('id', body.pathParameters.id)
    
    if(message.length == 0){
        return {
            statusCode: 404,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({'Message not found'}),
        }
    }

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(message),
    }
  })