import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.getUser()

        // check if user is logged in only then he is allowed to delete
        const id = event.context.params.id
        if(user.data.user) {
            const deletedVideo = await handleLoggedInUserVideoDeletion(client, user, id)
            return {
                statusCode: 200,
                headers: {
                    'content-type': 'application/json',
                },
                body: {deleted_video: deletedVideo},
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

  async function handleLoggedInUserVideoDeletion(client: any, user: any, videoId: string) {
    if(user.daat) {
        const {data: videos, error} = await client
            .from('user_videos')
            .select('video_id')
            .eq('user_id', user.data.id)
            .eq('video_id', videoId)
            .delete()
        if (error) {
            throw new Error('handleLoggedInUserVideos() error ' + error.message)
        }
        return videos[0]
    }
    throw new Error('handleLoggedInUserVideos() assumes user to be logged in')
  }