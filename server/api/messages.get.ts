import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)

        const body = await readBody(event)
        const {user_summary_id: userSummaryId} = JSON.parse(body)
        const user = await client.auth.user()

        // check if user is logged in and user_summary_id exists
        if(!user) {
            return {
                statusCode: 401,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({message: 'Unauthorized'}),
            }
        }
        
        const foundMessages = await handleMessagesRetrieval(client, userSummaryId, user)
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(foundMessages),
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



async function handleMessagesRetrieval(client: serverSuperbaseClient, userSummaryId: string, user: any) {
    const {data: found_messages, error} = await client
        .from('user_summaries')
        .select('messages.params')
        .eq('id', userSummaryId)
        .eq('user_id', user.id)
        .join('messages', {on: {'user_summaries.id': 'messages.user_summary_id'}})
        .order('messages.created_at', {ascending: false})
    if(error) {
        throw new Error('handleMessagesRetrieval error ' + error)
    }
    return found_messages
}