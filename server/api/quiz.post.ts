import generateQuiz from "../src/processText/generateQuiz";

export default defineEventHandler(async event => {
    const { transcript } = await readBody(event);
    console.log(transcript)
    const response = await generateQuiz(transcript)

    return { response: JSON.parse(response) };
});