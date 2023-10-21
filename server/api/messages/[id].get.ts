import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.user()

        const message = await handleMessageRetrieval(client, body)
        
        if(message.length == 0){
            return {
                statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify('Message not found'),
            }
        }

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(message[0]),
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

async function handleMessageRetrieval(client: serverSuperbaseClient, body: any) {
    const {data: message, error} = await client
        .from('messages')
        .select('*')
        .eq('id', body.pathParameters.id)
    if(error) {
        throw new Error('handleMessageRetrieval() error ' + error)
    }
    return message
}