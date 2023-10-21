import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event)
    const body = await readBody(event)

    const user = await client.auth.user()

    const {data: video, error} = await client
        .from('videos')
        .select('*')
        .eq('id', body.pathParameters.id)

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: video,
    }
  })