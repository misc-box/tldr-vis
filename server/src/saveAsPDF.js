import fs from 'fs';
import PDFKit from 'pdfkit';


function saveAsPDF(text, outputFilePath) {
    const doc = new PDFKit();
    doc.text(text);
    doc.pipe(fs.createWriteStream(outputFilePath));
    doc.end();
}

export default saveAsPDF;
