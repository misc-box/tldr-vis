import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)

        const user = await client.auth.user()

        // check if user is logged in then only return his videos
        let summaries: object
        if(user) {
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
            body: JSON.stringify(summaries),
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


async function handleUserSummaryRetrieval(client: serverSuperbaseClient, user: any) {
    const {data: summaries, error} = await client
        .from('user_summaries')
        .select('summaries.params')
        .eq('user_id', user.id)
        .join('summaries', {'summaries.id': 'user_summaries.summary_id'})
    if(error) {
        throw new Error('handleExistingVideo() error ' + error)
    }
    return summaries
}


async function handleAllSummaryRetrieval(client: serverSuperbaseClient) {
    const {data: summaries, error} = await client
        .from('summaries')
        .select('*')
    return summaries
}