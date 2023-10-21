import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    try{
        const client = await serverSuperbaseClient(event)

        const body = await readBody(event)
        const {videoUrl} = JSON.parse(body)
        const user = await client.auth.user()

        const videoId = await handleVideoInsert(videoUrl, client)
        await handleUserVideoInsert(videoUrl, videoId, user, client)
        
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({videoId}),
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

async function handleVideoInsert(videoUrl: string, client: serverSuperbaseClient) {
    // insert video_url into db if it does not yet exist
    let videoId: number
    const {data: foundVideos, error} = await client
        .from('videos')
        .select('id')
        .eq('video_url', videoUrl)
    if (error) {
        throw Error('handleVideoInsert() error ' + error)
    }
    if(foundVideos.lenght == 0) {
        await client.from('videos').insert([
            {url: videoUrl}
        ]) // insert video_url
        const {data: inserted_video, error} = await client
            .from('videos')
            .select('id')
            .eq('video_url', videoUrl)
            .single()
        if (error) {
            throw new Error('handleVideoInsert() error ' + error)
        }
        videoId = inserted_video.id
    }
    else{
        videoId = foundVideos[0].id
    }
    return videoId
}

async function handleUserVideoInsert(videoUrl: string, videoId: number, user: any, client: serverSuperbaseClient) {
    // insert video_url into db if it does not yet exist
    if(user) {
        const {data: foundUserVideos, error} = await client
            .from('user_videos')
            .select('id')
            .eq('user_id', user.id)
            .eq('video_url', videoUrl)
        if (error) {
            throw new Error('handleUserVideoInsert() error ' + error)
        }
        if(foundUserVideos.lenght == 0) {
            await client.from('user_videos').insert([
                {user_id: user.id, video_id: videoId}
            ]) // insert video_url
        }
    }
}