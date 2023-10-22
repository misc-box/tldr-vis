import fs from 'fs/promises';

async function writeTextFile(filePath, textContent) {
    try {
        await fs.writeFile(filePath, textContent, 'utf8');
        console.log('File written successfully.');
    } catch (error) {
        console.error('Error writing file:', error.message);
        throw error;  // Re-throw the error so it can be handled by the caller
    }
}

export default writeTextFile;
