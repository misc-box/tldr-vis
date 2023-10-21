import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)

        const body = await readBody(event)
        const user = await client.auth.user()


        const foundTopics = await handleTopicRetrieval(client, user)

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(foundTopics),
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

async function handleTopicRetrieval(client: serverSuperbaseClient, user: any) {
    const {data: foundTopics, error: error} = await client
        .from('topics')
        .select('*')
    if(error) {
        throw new Error('handleTopicRetrieval() error ' + error)
    }
    return foundTopics
}