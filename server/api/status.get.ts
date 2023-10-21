export const status = { text: "Not Processing", percentDone: 0 } 

export default defineEventHandler(event => {
    return status;
});