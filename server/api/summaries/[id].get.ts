import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)
    const body = await readBody(event)

    const user = await client.auth.user()

    const {data: summary, error} = await client
        .from('summaries')
        .select('*')
        .eq('id', body.pathParameters.id)

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(summary),
    }
  })