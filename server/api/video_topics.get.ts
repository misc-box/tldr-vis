import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)

    const body = await readBody(event)
    const {video_id} = JSON.parse(body)
    const user = await client.auth.user()

    // check if user is logged in and user_summary_id exists
    const {data: video_topics, error_found_user_summaries} = await client
        .from('video_topics')
        .select('video_topics.params')
        .join('videos', {on: {'video_topics.video_id': 'video.id'}})
        .eq('video.id', video_id)
    if(error_found_user_summaries) {
        return {
            statusCode: 500,
            headers: {
                'content-type': 'application/json',
            },
            body: {message: 'Internal server error'},
        }
    }

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: video_topics,
    }
    
  })