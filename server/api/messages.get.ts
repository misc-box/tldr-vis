import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)

        const body = await readBody(event)
        const user = await client.auth.getUser()

        // check if user is logged in and user_summary_id exists
        if(!user.data.user) {
            return {
                statusCode: 401,
                headers: {
                    'content-type': 'application/json',
                },
                body: {message: 'Unauthorized'},
            }
        }
        
        const foundMessages = await handleMessagesRetrieval(client, user)
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {found_messages: foundMessages},
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



async function handleMessagesRetrieval(client: any, user: any) {
    const {data: found_messages, error} = await client
        .from('user_summaries')
        .select('messages.params')
        .eq('user_id', user.data.user.id)
        .join('messages', {on: {'user_summaries.id': 'messages.user_summary_id'}})
        .order('messages.created_at', {ascending: false})
    if(error) {
        throw new Error('handleMessagesRetrieval error ' + error.message)
    }
    return found_messages
}