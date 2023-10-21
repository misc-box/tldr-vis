import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.user()

        const suggestedQuestion = await handleSuggestedQuestionRetrieval(client, body)
        
        if(suggestedQuestion.length == 0){
            return {
                statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify('Suggested question not found'),
            }
        }

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(suggestedQuestion[0]),
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

async function handleSuggestedQuestionRetrieval(client: serverSuperbaseClient, body: any) {
    const {data: suggestedQuestion, error} = await client
        .from('suggested_questions')
        .select('*')
        .eq('id', body.pathParameters.id)
    if(error) {
        throw new Error('handleSuggestedQuestionRetrieval() error ' + error)
    }
    return suggestedQuestion
}