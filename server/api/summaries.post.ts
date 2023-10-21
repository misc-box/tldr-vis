import { serverSuperbaseClient } from '#supabase/server'
import { processVideo } from '../src/processVideo'

export default defineEventHandler(async (event) => {

    try{
        const client = await serverSuperbaseClient(event)

        const body = await readBody(event)
        const {video_id: videoId, length} = JSON.parse(body)
        const user = await client.auth.user()

        // check if summary already exists
        let summary: object
        summary = await handleExistingSummary(client, videoId, length, user)
        if(!summary) {
            const existingVideo = await handleExistingVideo(client, videoId, user)
            if(!existingVideo) {
                return {
                    statusCode: 404,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({message: 'Video not found in database'}),
                }
            }
            await handleUserVideoInsert(client, videoId, user)
            const summary = await handleSummaryInsert(client, videoId, length, user)
            await handleUserSummaryInsert(client, summary.id, user)
            processVideo(existingVideo.video_url) 
            //TODO: await handleSummaryTopicInsert(client, insertedSummary.id, user, videoTopics)
            //TODO: await hanldeSuggestedQuestionInsert(client, insertedSummary.id, suggestedQuestions)
        }
        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({summary}),
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


async function handleExistingSummary(client: serverSuperbaseClient, videoId: number, length: number, user: any) {

    const {data: foundSummaries, error} = await client
        .from('summaries')
        .select('id')
        .eq('video_id', videoId)
        .eq('length', length)
    if(error) {
        throw new Error('handleExistingSummary() error ' + error)
    }
    if(foundSummaries.lenght != 0) {

        // check if user is logged in and has video not yet added then inset it
        if(user) {
            const {data: userSummaries, error} = await client
                .from('user_summaries')
                .select('id')
                .eq('user_id', user.id)
                .eq('summary_id', foundSummaries[0].id)
            if (error) {
                throw new Error('handleExistingSummary() error ' + error)
            }
            if(userSummaries.lenght == 0) {
                await client.from('user_summaries').insert([
                    {user_id: user.id, summary_id: foundSummaries[0].id}
                ])
            }
        }

        return foundSummaries[0]
    }
    return null
}

async function handleExistingVideo(client: serverSuperbaseClient, videoId: number, user: any) {
    const {data: foundVideos, error} = await client
        .from('videos')
        .select('id', 'video_url')
        .eq('id', videoId)
    if(error) {
        throw new Error('handleExistingVideo() error ' + error)
    }
    if(foundVideos.lenght != 0) {
        return foundVideos[0]
    }
    return null
}


async function handleUserVideoInsert(client: serverSuperbaseClient, videoId: number, user: any) {
    // insert video_url into db if it does not yet exist
    if(user) {
        const {data: foundUserVideos, error} = await client
            .from('user_videos')
            .select('id')
            .eq('user_id', user.id)
            .eq('video_id', videoId)
        if (error) {
            throw new Error('handleUserVideoInsert() error ' + error)
        }
        if(foundUserVideos.lenght == 0) {
            await client.from('user_videos').insert([
                {user_id: user.id, video_id: videoId}
            ])
        }
    }
}


async function handleSummaryInsert(client: serverSuperbaseClient, videoId: number, length: number, user: any) {
    

    await client.from('summaries').insert([
        {video_id: videoId, length: length}
    ])

    const {data: insertedSummary, error: errorInsert} = await client
        .from('summaries')
        .select('id')
        .eq('video_id', videoId)
        .eq('length', length)
        .single()
    if (errorInsert) {
        throw new Error('handleSummaryInsert() error ' + errorInsert)
    }

    return insertedSummary
}

async function handleUserSummaryInsert(client: serverSuperbaseClient, summaryId: number, user: any) {

    if(user) {
        const {data: foundUserSummaries, error} = await client
            .from('user_summaries')
            .select('id')
            .eq('user_id', user.id)
            .eq('summary_id', summaryId)
        if (error) {
            throw new Error('handleUserSummaryInsert() error ' + error)
        }
        if(foundUserSummaries.lenght == 0) {
            await client.from('user_summaries').insert([
                {user_id: user.id, summary_id: summaryId}
            ])
        }
    }
}