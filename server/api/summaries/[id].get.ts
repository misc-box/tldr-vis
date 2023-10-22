import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event)

    const { data: summary, error } = await client.from('global_summaries').select('*').eq("id", atob(event.context.params.id)).single();

    if (summary === null || summary === undefined) {
        return {
            statusCode: 404,
            headers: {
                'content-type': 'application/json',
            },
            body: { message: 'Summary not found' },
        }
    }

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: summary,
    }
})