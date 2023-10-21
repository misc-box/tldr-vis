import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

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
  })