import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)

        const user = await client.auth.getUser()

        const id = event.pathParameters.id
        const suggestedQuestion = await handleSuggestedQuestionRetrieval(client, id)
        
        if(suggestedQuestion.length == 0){
            return {
                statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                },
                body: {message: 'Suggested question not found'},
            }
        }

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {suggested_question: suggestedQuestion[0]},
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

async function handleSuggestedQuestionRetrieval(client: any, id: string) {
    const {data: suggestedQuestion, error} = await client
        .from('suggested_questions')
        .select('*')
        .eq('id', id)
    if(error) {
        throw new Error('handleSuggestedQuestionRetrieval() error ' + error.message)
    }
    return suggestedQuestion
}