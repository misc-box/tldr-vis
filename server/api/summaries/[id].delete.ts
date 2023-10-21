import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)
    const body = await readBody(event)

    const user = await client.auth.user()

    // check if user is logged in only then he is allowed to delete
    if(user) {
        const summary = await handleLoggedInUserSummaryDeletion(client, user, body)
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({id: summary.id}),
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

async function handleLoggedInUserSummaryDeletion(client: serverSuperbaseClient, user: any, body: any) {
    if(user) {
        const {data: summary, error} = await client
            .from('user_summaries')
            .select('summary_id')
            .eq('user_id', user.id)
            .eq('summary_id', body.pathParameters.id)
            .delete()
        if (error) {
            throw new Error('handleLoggedInUserSummaryDeletion() error ' + error)
        }
        return summary[0]
    }
    throw new Error('handleLoggedInUserSummaryDeletion() assumes user to be logged in')
}