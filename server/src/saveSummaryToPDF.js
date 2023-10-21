import fs from 'fs';
import PDFKit from 'pdfkit';


function saveAsPDF(text, name) {
    const doc = new PDFKit();
    doc.text(text);
    // timestamp

    const outputFilePath = `./server/output/${name}.pdf`;

    doc.pipe(fs.createWriteStream(outputFilePath));
    doc.end();
    return outputFilePath;
}

export default saveAsPDF;
