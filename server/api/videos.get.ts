import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)

    const user = await client.auth.user()

    // check if user is logged in then only return his videos
    if(user) {
        const {data: user_videos, error} = await client
            .from('user_videos')
            .select('video_id')
            .eq('user_id', user.id)
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(user_videos),
        }
    }

    //otherwise return all videos
    const {data: videos, error} = await client
        .from('videos')
        .select('id')
    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(videos),
    }
  })