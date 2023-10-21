import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)
    const body = await readBody(event)

    const user = await client.auth.user()

    const {data: suggested_question, error} = await client
        .from('suggested_questions')
        .select('*')
        .eq('id', body.pathParameters.id)
    
    if(suggested_question.length == 0){
        return {
            statusCode: 404,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({'Suggested question not found'}),
        }
    }

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(suggested_question),
    }
  })