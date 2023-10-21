import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)
    const body = await readBody(event)

    const user = await client.auth.user()

    // TODO: what if user does not exist; return `200`?
    user && await client.auth.signOut()
    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: {message: 'User logged out'},
    }
  })