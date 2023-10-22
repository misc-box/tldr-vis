import fs from 'fs/promises';

async function readTextFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return data;
    } catch (error) {
        console.error('Error reading file:', error.message);
        throw error;  // Re-throw the error so it can be handled by the caller
    }
}

export default readTextFile;
