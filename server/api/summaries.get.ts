import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)

        const user = await client.auth.getUser()

        // check if user is logged in then only return his videos
        let summaries: object
        if(user.data.user) {
            summaries = await handleUserSummaryRetrieval(client, user)
        }
        else {
            summaries = await handleAllSummaryRetrieval(client)
        }


        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {summaries: summaries},
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


async function handleUserSummaryRetrieval(client: any, user: any) {
    const {data: summaries, error} = await client
        .from('user_summaries')
        .select('summaries.params')
        .eq('user_id', user.data.user.id)
        .join('summaries', {'summaries.id': 'user_summaries.summary_id'})
    if(error) {
        throw new Error('handleExistingVideo() error ' + error)
    }
    return summaries
}


async function handleAllSummaryRetrieval(client: any) {
    const {data: summaries, error} = await client
        .from('summaries')
        .select('*')
    return summaries
}