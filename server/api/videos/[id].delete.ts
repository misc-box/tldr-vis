import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.user()

        // check if user is logged in only then he is allowed to delete
        if(user) {
            const deletedVideo = await handleLoggedInUserVideoDeletion(client, user, body.pathParameters.id, body)
            return {
                statusCode: 200,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(deletedVideo),
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

  async function handleLoggedInUserVideoDeletion(client: serverSuperbaseClient, user: any, videoId: number, body: any) {
    if(user) {
        const {data: videos, error} = await client
            .from('user_videos')
            .select('video_id')
            .eq('user_id', user.id)
            .eq('video_id', body.pathParameters.id)
            .delete()
        if (error) {
            throw new Error('handleLoggedInUserVideos() error ' + error)
        }
        return videos[0]
    }
    throw new Error('handleLoggedInUserVideos() assumes user to be logged in')
  }