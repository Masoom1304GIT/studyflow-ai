import { extractText } from 'unpdf';

/**
 * Extracts clean text and metadata from a PDF buffer.
 * @param {Buffer|Uint8Array} pdfBuffer
 * @returns {Promise<{text: string, pageCount: number, wordCount: number}>}
 */
export async function extractPdfContent(pdfBuffer) {
  try {
    const uint8Array = new Uint8Array(pdfBuffer);
    const { text, totalPages } = await extractText(uint8Array);

    const fullText = Array.isArray(text) ? text.join('\n\n') : String(text || '');
    const cleanText = fullText
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[ \u00A0]+/g, ' ')
      .trim();

    if (!cleanText || cleanText.length < 20) {
      throw new Error('Extracted text is empty or too short to generate a revision pack.');
    }

    const words = cleanText.split(/\s+/).filter(Boolean);

    return {
      text: cleanText,
      pageCount: totalPages || 1,
      wordCount: words.length
    };
  } catch (err) {
    console.error('PDF Extraction Error:', err);
    throw new Error(`Failed to extract text from PDF: ${err.message}`);
  }
}
