import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)
    const body = await readBody(event)

    const user = await client.auth.user()
    if(user){
        return {
            statusCode: 400,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify("User already logged in"),
        }
    }
  })