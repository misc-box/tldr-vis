import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function generatePDFFromLatex(
  latexSource: string,
  outputDirectory: string
): Promise<any> {
  try {
    await execAsync(`pdflatex -output-directory=${outputDirectory} -interaction=nonstopmode ${latexSource}`);
  } catch (error: any) {
    throw new Error(`Error generating PDF: ${error.stderr || error.message}`);
  }
}

export { generatePDFFromLatex };
