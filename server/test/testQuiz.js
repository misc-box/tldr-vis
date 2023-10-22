// test quiz
import fs from 'fs/promises';

const file = await fs.readFile('server/output/transcription-long.txt', 'utf-8');

// quiz 
import generateQuiz from '../src/processText/generateQuiz.js';
generateQuiz(file)
    .then(quiz => console.log('Quiz:', quiz))
    .catch(error => console.error('Error:', error));

