import { serverSupabaseClient } from '#supabase/server'
import processVideo from '../src/processVideo'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSupabaseClient(event)

        const body = await readBody(event)
        const {video_id: videoId, length, type} = body
        const user = await client.auth.getUser()

        // check if summary already exists
        let summary: object
        summary = await handleExistingSummary(client, videoId, length, type, user)
        if(!summary) {
            const existingVideo = await handleExistingVideo(client, videoId, user)
            if(!existingVideo) {
                return {
                    statusCode: 404,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: {message: 'Video not found in database'},
                }
            }
            await handleUserVideoInsert(client, videoId, user)
            const summary = await handleSummaryInsert(client, videoId, length, type, user)
            await handleUserSummaryInsert(client, summary.id, user)
            processVideo(existingVideo.url) 
            //await handleSummaryTopicInsert(client, insertedSummary.id, user, videoTopics)
            //await hanldeSuggestedQuestionInsert(client, insertedSummary.id, suggestedQuestions)
        }
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {summary},
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


async function handleExistingSummary(client: any, videoId: string, length: number, type: string, user: any) {

    const {data: foundSummaries, error} = await client
        .from('summaries')
        .select('id')
        .eq('video_id', videoId)
        .eq('length', length)
        .eq('type', type)
    if(error) {
        return null
    }
    if(foundSummaries.length != 0) {

        // check if user is logged in and has video not yet added then inset it
        if(user.data.user) {
            const {data: userSummaries, error} = await client
                .from('user_summaries')
                .select('id')
                .eq('user_id', user.data.id)
                .eq('summary_id', foundSummaries[0].id)
            if (error) {
                throw new Error('handleExistingSummary() error 2' + error.message)
            }
            if(userSummaries.lenght == 0) {
                await client.from('user_summaries').insert([
                    {user_id: user.data.id, summary_id: foundSummaries[0].id}
                ])
            }
        }

        return foundSummaries[0]
    }
    return null
}

async function handleExistingVideo(client: any, videoId: string, user: any) {
    const {data: foundVideos, error} = await client
        .from('videos')
        .select('id', 'video_url')
        .eq('id', videoId)
    if(error) {
        return null
    }
    if(foundVideos.lenght != 0) {
        return foundVideos[0]
    }
}


async function handleUserVideoInsert(client: any, videoId: string, user: any) {
    // insert url into db if it does not yet exist
    if(user.data.user) {
        const {data: foundUserVideos, error} = await client
            .from('user_videos')
            .select('id')
            .eq('user_id', user.data.id)
            .eq('video_id', videoId)
        if (error) {
            throw new Error('handleUserVideoInsert() error ' + error.message)
        }
        if(foundUserVideos.length == 0) {
            await client.from('user_videos').insert([
                {user_id: user.data.id, video_id: videoId}
            ])
        }
    }
}


async function handleSummaryInsert(client: any, videoId: string, length: number, type: string, user: any) {
    

    const summary = await client.from('summaries').insert([
        {video_id: videoId, length: length, type: type}
    ])

    return summary
}

async function handleUserSummaryInsert(client: any, summaryId: string, user: any) {

    if(user.data.user.id) {
        const {data: foundUserSummaries, error} = await client
            .from('user_summaries')
            .select('id')
            .eq('user_id', user.data.user.id)
            .eq('summary_id', summaryId)
        if (error) {
            throw new Error('handleUserSummaryInsert() error 2' + error.message)
        }
        if(foundUserSummaries.length == 0) {
            await client.from('user_summaries').insert([
                {user_id: user.data.user.id, summary_id: summaryId}
            ])
        }
    }
}