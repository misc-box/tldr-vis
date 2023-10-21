import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    try{
        const client = await serverSuperbaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.user()
        user && await client.auth.signOut()
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify("User logged out"),
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