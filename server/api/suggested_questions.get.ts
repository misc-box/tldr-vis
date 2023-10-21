import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)

    const body = await readBody(event)
    const {video_topic_id} = JSON.parse(body)
    const user = await client.auth.user()

    // check if user is logged in and user_summary_id exists
    const {data: suggested_questions, error_found_user_summaries} = await client
        .from('suggested_questions')
        .select('suggested_questions.params')
        .join('video_topics', {on: {'video_topics.id': 'suggested_questions.video_topics_id'}})
        .eq('video_topics.id', video_topic_id)
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
        body: {message: suggested_questions},
    }
    
  })