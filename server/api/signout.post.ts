import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    try{
        const client = await serverSupabaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.getUser()
        user.data.user && await client.auth.signOut()
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {message: "User logged out"},
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