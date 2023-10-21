import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.user()

        const summary = await handleSummaryRetrieval(client, body)    
        if(summary.length == 0){
            return {
                statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify('Summary not found'),
            }
        }

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(summary[0]),
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

async function handleSummaryRetrieval(client: serverSuperbaseClient, body: any) {
    const {data: summary, error} = await client
        .from('summaries')
        .select('*')
        .eq('id', body.pathParameters.id)
    if(error) {
        throw new Error('handleSummaryRetrieval() error ' + error)
    }
    return summary
}

