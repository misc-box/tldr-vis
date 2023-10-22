import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)

        const user = await client.auth.getUser()
        const id = event.context.params.id

        const video = await handleVideoRetrieval(client, id)
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {video: video[0]},
        }
    }

    catch(error) {
        return {
            statusCode: 500,
            headers: {
                'content-type': 'application/json',
            },
            body: error,
        }
    }
  })


async function handleVideoRetrieval(client: any, id: string) {
    const {data: video, error} = await client
        .from('videos')
        .select('*')
        .eq('id', id)
    if(error) {
        throw new Error('handleVideoRetrieval() error ' + error.message)
    }
    return video
}