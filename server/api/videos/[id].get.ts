import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.user()

        const video = await handleVideoRetrieval(client, body)
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(video[0]),
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


async function handleVideoRetrieval(client: serverSuperbaseClient, body: any) {
    const {data: video, error} = await client
        .from('videos')
        .select('*')
        .eq('id', body.pathParameters.id)
    if(error) {
        throw new Error('handleVideoRetrieval() error ' + error)
    }
    return video
}