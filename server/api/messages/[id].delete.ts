import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.user()

        // check if user is logged in only then he is allowed to delete
        if(user) {
            const message = await handleLoggedInUserMessageDeletion(client, user, body)
            return {
                statusCode: 200,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(message),
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

async function handleLoggedInUserMessageDeletion(client: serverSuperbaseClient, user: any, body: any) {
    if(user) {
        const {data: message, error} = await client
            .from('message')
            .select('message_id')
            .eq('user_id', user.id)
            .eq('message_id', body.pathParameters.id)
            .delete()
        if (error) {
            throw new Error('handleLoggedInUserMessageDeletion() error ' + error)
        }
        return message[0]
    }
    throw new Error('handleLoggedInUserMessageDeletion() assumes user to be logged in')
}