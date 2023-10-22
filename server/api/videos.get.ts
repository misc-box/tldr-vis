import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)
        const user = await client.auth.getUser()
        
        let videos: any[] = []
            if(user.data.user){
                videos = await handleLoggedInUserVideos(client, user)
            }
            else {
                videos = await handleAnonymousUserVideos(client)
            }
            
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {videos: videos},
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


  async function handleLoggedInUserVideos(client: any, user: any) {
    if(user.data.user) {
        const {data: videos, error} = await client
            .from('user_videos')
            .select('videos.params')
            .eq('user_id', user.data.user.id)
            .join('videos', {'videos.id': 'user_videos.video_id'})
        if (error) {
            throw new Error('handleLoggedInUserVideos() error ' + error.message)
        }
        return videos
    }
    throw new Error('handleLoggedInUserVideos() assumes user to be logged in')
  }

    async function handleAnonymousUserVideos(client: any) {
        const {data: videos, error} = await client
            .from('videos')
            .select('*')
        if (error) {
            throw new Error('handleAnonymousUserVideos() error ' + error.message)
        }
        return videos
    }
