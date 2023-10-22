import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    try{
        const client = await serverSupabaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.getUser()

        // check if user is logged in only then he is allowed to delete
        const id = event.context.params.id
        if(user.data.user) {
            const summary = await handleLoggedInUserSummaryDeletion(client, user, id)
            return {
                statusCode: 200,
                headers: {
                    'content-type': 'application/json',
                },
                body: {id: summary.id},
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

async function handleLoggedInUserSummaryDeletion(client: any, user: any, id: string) {
    if(user.data) {
        const {data: summary, error} = await client
            .from('user_summaries')
            .select('summary_id')
            .eq('user_id', user.data.id)
            .eq('summary_id', id)
            .delete()
        if (error) {
            throw new Error('handleLoggedInUserSummaryDeletion() error ' + error.message)
        }
        return summary[0]
    }
    throw new Error('handleLoggedInUserSummaryDeletion() assumes user to be logged in')
}