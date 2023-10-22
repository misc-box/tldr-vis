import fs from 'fs';
import PDFKit from 'pdfkit';

async function saveAsPDF(text, name) {
    return new Promise(r => {
      const doc = new PDFKit();
      doc.text(text);
      // timestamp
  
  
      const outputFilePath = `${name}.pdf`;
      let stream = fs.createWriteStream(outputFilePath);
  
      doc.pipe(stream);
      doc.end();
  
      stream.on('finish', () => r(outputFilePath));
    })
}


export default saveAsPDF;
