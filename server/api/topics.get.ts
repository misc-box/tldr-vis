import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)

    const body = await readBody(event)
    const user = await client.auth.user()

    // check if user is logged in and user_summary_id exists
    const {data: found_topics, error_found_user_summaries} = await client
        .from('topics')
        .select('*')
    if(error_found_user_summaries) {
        return {
            statusCode: 500,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({message: 'Internal server error'}),
        }
    }

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(found_topics),
    }
    
  })