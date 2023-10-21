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
            body: {message: 'User already logged in'},
        }
    }
    else {
        const { email, password } = JSON.parse(body)
        const { user, session, error } = await client.auth.signUp({
            email,
            password,
        })
        if(error){
            return {
                statusCode: 400,
                headers: {
                    'content-type': 'application/json',
                },
                body: error,
            }
        }
        else {
            return {
                statusCode: 200,
                headers: {
                    'content-type': 'application/json',
                },
                body: { user, session },
            }
        }
    }
  })