import fs from 'fs';
import saveAsPDF from '../src/processText/saveSummaryToPDF.js';

(async () => {
    try {
        const text = '## Hallo This is a test PDF document 123.';
        const outputFilePath = './server/test/output/test.pdf';
        saveAsPDF(text, outputFilePath);

        // Optionally, check if the file has been created
        fs.access(outputFilePath, fs.constants.F_OK, (err) => {
            console.log(err ? 'File does not exist' : 'File exists');
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
