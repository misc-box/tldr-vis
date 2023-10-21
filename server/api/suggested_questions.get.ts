import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)

        const body = await readBody(event)
        const {video_topic_id: videoTopicId} = JSON.parse(body)
        const user = await client.auth.user()

        // check if user is logged in and user_summary_id exists
        const suggestedQuestions = await handleSuggestedQuestionsRetrieval(client, videoTopicId)

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(suggestedQuestions),
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

async function handleSuggestedQuestionsRetrieval(client: serverSuperbaseClient, video_topic_id: string) {
    const {data: suggested_questions, error} = await client
        .from('suggested_questions')
        .select('suggested_questions.params')
        .join('video_topics', {on: {'video_topics.id': 'suggested_questions.video_topics_id'}})
        .eq('video_topics.id', video_topic_id)
    if(error) {
        throw new Error('handleSuggestedQuestionsRetrieval() error ' + error)
    }
    return suggested_questions
}