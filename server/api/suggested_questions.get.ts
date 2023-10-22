import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)

        const user = await client.auth.getUser()

        // check if user is logged in and user_summary_id exists
        const suggestedQuestions = await handleSuggestedQuestionsRetrieval(client)

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {suggested_questions: suggestedQuestions},
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

async function handleSuggestedQuestionsRetrieval(client: any) {
    const {data: suggested_questions, error} = await client
        .from('suggested_questions')
        .select('suggested_questions.params')
        .join('video_topics', {on: {'video_topics.id': 'suggested_questions.video_topics_id'}})
    if(error) {
        throw new Error('handleSuggestedQuestionsRetrieval() error ' + error.message)
    }
    return suggested_questions
}