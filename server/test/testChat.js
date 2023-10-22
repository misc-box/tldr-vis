// test quiz
import fs from 'fs/promises';
import chat from '../src/processText/chat.js';

const file = await fs.readFile('server/output/transcription-long.txt', 'utf-8');


const question = 'What is the difference of this lecture to advanced machine learning?' //'What will be the main topics of the lecture, how will I be graded?';
chat(file, question)
    .then(res => console.log('Answer:', res))
    .catch(error => console.error('Error:', error));

