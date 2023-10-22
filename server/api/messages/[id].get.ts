import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)

        const user = await client.auth.getUser()

        const id = event.pathParameters.id
        const message = await handleMessageRetrieval(client, id)
        
        if(message.length == 0){
            return {
                statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                },
                body: {message:'Message not found'},
            }
        }

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {message: message[0]},
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

async function handleMessageRetrieval(client: any, id: string) {
    const {data: message, error} = await client
        .from('messages')
        .select('*')
        .eq('id', id)
    if(error) {
        throw new Error('handleMessageRetrieval() error ' + error.message)
    }
    return message
}