import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    try{
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
        else {
            const { email, password } = JSON.parse(body)
            const { user, session, error } = await client.auth.singIn({
                email,
                password,
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
                    body: JSON.stringify({ user, session }),
                }
            }
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

