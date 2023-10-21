import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)

        const user = await client.auth.user()
        
        let videos: any[] = []
            if(user){
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
            body: JSON.stringify({videos: videos}),
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


  async function handleLoggedInUserVideos(client: serverSuperbaseClient, user: any) {
    if(user) {
        const {data: videos, error} = await client
            .from('user_videos')
            .select('videos.params')
            .eq('user_id', user.id)
            .join('videos', {'videos.id': 'user_videos.video_id'})
        if (error) {
            throw new Error('handleLoggedInUserVideos() error ' + error)
        }
        return videos
    }
    throw new Error('handleLoggedInUserVideos() assumes user to be logged in')
  }

    async function handleAnonymousUserVideos(client: serverSuperbaseClient) {
        const {data: videos, error} = await client
            .from('videos')
            .select('*')
        if (error) {
            throw new Error('handleAnonymousUserVideos() error ' + error)
        }
        return videos
    }
