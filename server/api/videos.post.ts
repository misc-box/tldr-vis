import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    try{
        const client = await serverSupabaseClient(event)

        const body = await readBody(event)
        const {url: videoUrl} = body
        const user = await client.auth.getUser()

        const videoId = await handleVideoInsert(videoUrl, client)
        await handleUserVideoInsert(videoUrl, videoId, user, client)
        
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {id: videoId},
        }
    }

    catch(error: any) {
        return {
            statusCode: 500,
            headers: {
                'content-type': 'application/json',
            },
            body:{message: error.message},
        }
    }
  })

async function handleVideoInsert(videoUrl: string, client: any) {
    // insert video_url into db if it does not yet exist
    let videoId: string
    const {data: foundVideos, error} = await client
        .from('videos')
        .select('id')
        .eq('url', videoUrl)
    if (error) {
        throw Error('handleVideoInsert() error 1 ' + error.message)
    }
    if(foundVideos.length == 0) {
        const {data: inserted_video, error} = await client
            .from('videos')
            .insert([
                {url: videoUrl}
            ])
            .select()
        if (error) {
            throw new Error('handleVideoInsert() error 2' + error.message)
        }
        videoId = inserted_video[0].id
    }
    else{
        videoId = foundVideos[0].id
    }
    return videoId
}

async function handleUserVideoInsert(videoUrl: string, videoId: string, user: any, client: any) {
    // insert video_url into db if it does not yet exist
    if(user.data.user) {
        const {data: foundUserVideos, error} = await client
            .from('user_videos')
            .select('id')
            .eq('user_id', user.data.user.id)
            .eq('video_id', videoId)
        if (error) {
            throw new Error('handleUserVideoInsert() error ' + error.message)
        }
        if(foundUserVideos.lenght == 0) {
            await client.from('user_videos').insert([
                {user_id: user.data.id, video_id: videoId}
            ]) // insert video_url
        }
    }
}