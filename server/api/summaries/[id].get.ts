import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)

        const user = await client.auth.getUser()

        const id = event.context.params.id
        const summary = await handleSummaryRetrieval(client, id)    
        if(summary.length == 0){
            return {
                statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                },
                body: {message: 'Summary not found'},
            }
        }

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {summary: summary[0]},
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

async function handleSummaryRetrieval(client: any, id: string) {
    const {data: summary, error} = await client
        .from('summaries')
        .select('*')
        .eq('id', id)
    if(error) {
        throw new Error('handleSummaryRetrieval() error ' + error.message)
    }
    return summary
}

