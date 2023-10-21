import summarizeText from '../src/summarizeTranscription.js';



// Test the summarization function
let text = `Today, we'll delve into the fascinating world of Artificial Intelligence, or AI. AI is a branch of computer science that emphasizes the creation of intelligent machines capable of performing tasks that typically require human intelligence. These tasks include problem-solving, speech recognition, planning, learning, perception, and the ability to manipulate and move objects.

The journey of AI began in the early 20th century with the dream of creating machines capable of mimicking the human mind.One notable milestone was Alan Turing's proposal of the Turing Test in 1950, which was designed to evaluate a machine's ability to exhibit intelligent behavior indistinguishable from that of a human.

Fast forward to the 21st century, and we have witnessed a surge in AI advancements, driven by increased computational power and the availability of large datasets.Machine Learning, a subset of AI, has become a fundamental method for training machines to learn from data and make predictions or decisions.

Deep Learning, a further subset of Machine Learning, employs neural networks with multiple layers to analyze various levels of data.It has been instrumental in achieving state - of - the - art results in various fields, including image and speech recognition.

The potential applications of AI are vast and transformative.From healthcare, where AI can aid in diagnosis and personalized medicine, to the automotive industry, where self - driving cars are becoming a reality.However, with these advancements come ethical considerations, such as data privacy and the potential for job displacement.

In conclusion, AI is a dynamic and ever - evolving field with the potential to reshape our world.But it also presents challenges that we, as a society, need to address to ensure that the benefits of AI are realized in a responsible and equitable manner.
`;
summarizeText(text, 'short')
    .then(summary => console.log('Summary:', summary))
    .catch(error => console.error('Error:', error));
