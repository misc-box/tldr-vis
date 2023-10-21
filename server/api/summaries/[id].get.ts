import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    const user = await client.auth.user()

    const {data: summary, error} = await client
        .from('summaries')
        .select('*')
        .eq('id', body.pathParameters.id)
    
    if(summary.length == 0){
        return {
            statusCode: 404,
            headers: {
                'content-type': 'application/json',
            },
            body: {message: 'Summary not found'},
        }
    }

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: summary,
    }
  })