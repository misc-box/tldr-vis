import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)

    const body = await readBody(event)
    const {user_summary_id} = JSON.parse(body)
    const user = await client.auth.user()

    // check if user is logged in and user_summary_id exists
    if(!user) {
        return {
            statusCode: 401,
            headers: {
                'content-type': 'application/json',
            },
            body: {message: 'Unauthorized'},
        }
    }
    const {data: found_messages, error_found_user_summaries} = await client
        .from('user_summaries')
        .select('messages.params')
        .eq('id', user_summary_id)
        .eq('user_id', user.id)
        .join('messages', {on: {'user_summaries.id': 'messages.user_summary_id'}})
        .order('messages.created_at', {ascending: false})
    if(error_found_user_summaries) {
        return {
            statusCode: 500,
            headers: {
                'content-type': 'application/json',
            },
            body: {message: 'Internal server error'},
        }
    }

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: found_messages,
    }
    
  })