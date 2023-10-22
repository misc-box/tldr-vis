import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)

        const user = await client.auth.getUser()


        const foundTopics = await handleTopicRetrieval(client, user)

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {found_topics: foundTopics},
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

async function handleTopicRetrieval(client: any, user: any) {
    const {data: foundTopics, error: error} = await client
        .from('topics')
        .select('*')
    if(error) {
        throw new Error('handleTopicRetrieval() error ' + error.message)
    }
    return foundTopics
}