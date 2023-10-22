import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)
        const body = await readBody(event)

        const user = await client.auth.getUser()
        if(user.data.user){
            return {
                statusCode: 400,
                headers: {
                    'content-type': 'application/json',
                },
                body: {message: "User already logged in"},
            }
        }
        else {
            const { email, password } = body
            const {data, error}  = await client.auth.signInWithPassword({
                email,
                password
            })
            if(error){
                throw new Error('handleSingIn() error ' + error)
            }
            else {
                return {
                    statusCode: 200,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: { user: data.user, session: data.session},
                }
            }
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

