import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)

        const body = await readBody(event)
        const {text, type, user_summary_id: userSummaryId} = body
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
        const foundUserSummaries = await handleUserSummaryRetrieval(client, userSummaryId, user)

        if(foundUserSummaries.length == 0) {
            return {
                statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                },
                body: {message: 'User summary not found in database'},
            }
        }

        // check if text is not empty
        if(type(foundUserSummaries.text) != String || text.length == 0){
            return {
                statusCode: 400,
                headers: {
                    'content-type': 'application/json',
                },
                body: {message: 'Text cannot be empty'},
            }
        }

        // insert message
        const insertedMessage = await handleMessageInsertion(client, text, type, userSummaryId)
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {message_id: insertedMessage.id},
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


  async function handleUserSummaryRetrieval(client: any, userSummaryId: number, user: any) {
    const {data: foundUserSummaries, error} = await client
        .from('user_summaries')
        .select('id')
        .eq('id', userSummaryId)
        .eq('user_id', user.data.user.id)
    if(error) {
        throw new Error('handleUserSummaryRetrieval() error ' + error.message)
    }
    return foundUserSummaries
  }

  
  async function handleMessageInsertion(client: any, text: string, type: string, userSummaryId: number) {
    const {data: insertedMessage, error} = await client
        .from('messages')
        .insert([
            {text: text, type: type, user_summary_id: userSummaryId}
        ])
    if(error) {
        throw new Error('handleMessageInsertion() error ' + error.message)
    }
    return insertedMessage[0]
  }