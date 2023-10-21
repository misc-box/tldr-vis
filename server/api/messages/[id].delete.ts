import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)
    const body = await readBody(event)

    const user = await client.auth.user()

    // check if user is logged in only then he is allowed to delete
    if(user) {
        const {data: message, error} = await client
            .from('message')
            .select('message_id')
            .eq('user_id', user.id)
            .eq('message_id', body.pathParameters.id)
            .delete()
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(user_summaries),
        }
    }
    else {
        return {
            statusCode: 401,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({message: 'Unauthorized'}),
        }
    }
  })