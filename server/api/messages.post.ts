import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event)

    const body = await readBody(event)
    const {text, type, user_summary_id} = JSON.parse(body)
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
    const {data: found_user_summaries, error_found_user_summaries} = await client
        .from('user_summaries')
        .select('id')
        .eq('id', user_summary_id)
        .eq('user_id', user.id)
    if(found_user_summaries.lenght == 0) {
        return {
            statusCode: 404,
            headers: {
                'content-type': 'application/json',
            },
            body: {message: 'User summary not found in database'},
        }
    }

    // check if text is not empty
    if(type(text) != String || text.lenght == 0){
        return {
            statusCode: 400,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({message: 'Text cannot be empty'}),
        }
    }

    // insert message
    const {data: inserted_messages, error_inserted_messages} = await client
        .from('messages')
        .insert([
            {text: text, type: type, user_summary_id: user_summary_id}
        ])
    if(error_inserted_messages) {
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
        body: JSON.stringify({message_id: inserted_messages[0].id}),
    }
  })