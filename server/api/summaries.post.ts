import { serverSuperbaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {

    const client = await serverSuperbaseClient(event)

    const body = await readBody(event)
    const {video_id, length} = JSON.parse(body)
    const user = await client.auth.user()

    // check if summary already exists
    const {data: found_summaries, error_found_summaries} = await client
        .from('summaries')
        .select('id')
        .eq('video_id', video_id)
        .eq('length', length)
    if(found_summaries.lenght != 0) {

        // check if user is logged in and has video not yet added
        if(user) {
            const {data: user_summaries, error} = await client
                .from('user_summaries')
                .select('id')
                .eq('user_id', user.id)
                .eq('summary_id', found_summaries[0].id)
                .single()
            if(user_summaries.lenght == 0) {
                await client.from('user_summaries').insert([
                    {user_id: user.id, summary_id: found_summaries[0].id}
                ])
            }
        }

        return {
            statusCode: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({summary_id: found_summaries[0].id}),
        }
    }

    // check if video_id exists otherwise return 404
    const {data: found_video, error_found_video} = await client
        .from('videos')
        .select('id', 'video_url')
        .eq('id', video_id)
    if(found_video.lenght == 0) {
        return {
            statusCode: 404,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({message: 'Video not found in database'}),
        }
    }
    const video_url = found_video[0].video_url

    // check if user is logged in and has video not yet added
    if(user) {
        const {data: user_videos, error_user_video} = await client
            .from('user_videos')
            .select('id')
            .eq('user_id', user.id)
            .eq('video_url', video_url)
            .single()
        if(user_videos.lenght == 0) {
            await client.from('user_videos').insert([
                {user_id: user.id, video_id: found_video.id}
            ])
        }
    }

    //TODO:
    //const summary_path = await get_summary_from_video_url(video_url) 
    const summary_path = "test_path"

    // insert summary
    await client.from('summaries').insert([
        {video_id, length, summary_path}
    ])

    const {data: inserted_summary, error_inserted_summary} = await client
            .from('summaries')
            .select('id')
            .eq('video_id', video_id)
            .eq('length', length)
            .single()

    // if user is logged in insert user_summary
    if(user) {
        await client.from('user_summaries').insert([
            {user_id: user.id, summary_id: inserted_summary.id}
        ])
    }

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({summary_id: inserted_summary.id}),
    }

  })