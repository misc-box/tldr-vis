import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.getUser()

        // check if user is logged in only then he is allowed to delete
        const id = event.context.params.id
        if(user.data.user) {
            const message = await handleLoggedInUserMessageDeletion(client, user, id)
            return {
                statusCode: 200,
                headers: {
                    'content-type': 'application/json',
                },
                body: {message: message},
            }
        }
        else {
            return {
                statusCode: 401,
                headers: {
                    'content-type': 'application/json',
                },
                body: {message: 'Unauthorized'},
            }
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

async function handleLoggedInUserMessageDeletion(client: any, user: any, id: string) {
    if(user.data.user) {
        const {data: message, error} = await client
            .from('message')
            .select('message_id')
            .eq('user_id', id)
            .eq('message_id', body.pathParameters.id)
            .delete()
        if (error) {
            throw new Error('handleLoggedInUserMessageDeletion() error ' + error.message)
        }
        return message[0]
    }
    throw new Error('handleLoggedInUserMessageDeletion() assumes user to be logged in')
}