import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)

    const user = await client.auth.user()

    // check if user is logged in then only return his videos
    if(user) {
        const {data: user_videos, error} = await client
            .from('user_videos')
            .select('videos.params')
            .eq('user_id', user.id)
            .join('videos', {'videos.id': 'user_videos.video_id'})
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            //TODO: return only videos
            body: JSON.stringify(user_videos),
        }
    }

    //otherwise return all videos
    const {data: videos, error} = await client
        .from('videos')
        .select('*')
    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(videos),
    }
  })