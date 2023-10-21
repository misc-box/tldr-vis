// import { serverSupabaseClient } from '#supabase/server'

// export default defineEventHandler(async (event) => {

//     const client = await serverSupabaseClient(event)

//     const body = await readBody(event)
//     const {video_url} = JSON.parse(body)
//     const user = await client.auth.user()

//     // check if video_url does not yet exist in db
//     let video_id
//     const {data: found_videos, error} = await client
//         .from('videos')
//         .select('id')
//         .eq('video_url', video_url)
//     if(found_videos.lenght == 0) {
//         await client.from('videos').insert([
//             {url: video_url}
//         ]) // insert video_url
//         const {data: inserted_video, error} = await client
//             .from('videos')
//             .select('id')
//             .eq('video_url', video_url)
//             .single()
//         video_id = inserted_video.id
//     }
//     else{
//         video_id = found_videos[0].id
//     }

//     // check if user is logged in and has video not yet added
//     if(user) {
//         const {data: user_videos, error} = await client
//             .from('user_videos')
//             .select('id')
//             .eq('user_id', user.id)
//             .eq('video_url', video_url)
//             .single()
//         if(user_videos.lenght == 0) {
//             await client.from('user_videos').insert([
//                 {user_id: user.id, video_id}
//             ]) // insert video_url
//         }
//     }

//     return {
//         statusCode: 200,
//         headers: {
//             'content-type': 'application/json',
//         },
//         body: JSON.stringify({video_id}),
//     }

//   })