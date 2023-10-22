import chat from "../src/processText/chat";

export default defineEventHandler(async event => {
    const { transcript, question } = await readBody(event);
    console.log(transcript, question)
    const response = await chat(transcript, question)
    return { response };
});