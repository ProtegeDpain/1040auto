const { PDFDocument } = require('pdf-lib');
const docxToPdf = require('docx-pdf');
const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const docxToPdfPromise = util.promisify(docxToPdf);
const outputDir = '../testFileUpload';

// 🧠 Image to PDF using pdf-lib instead of sharp
async function imageToPDF(imagePath, outputPath) {
  const ext = path.extname(imagePath).toLowerCase();
  const buffer = await fs.readFile(imagePath);
  const pdfDoc = await PDFDocument.create();

  let image;
  if (ext === '.jpg' || ext === '.jpeg') {
    image = await pdfDoc.embedJpg(buffer);
  } else if (ext === '.png') {
    image = await pdfDoc.embedPng(buffer);
  } else {
    throw new Error(`[imageToPDF] Unsupported image format: ${ext}`);
  }

  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });

  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(outputPath, pdfBytes);
}

/**
 * Merges mixed-type files into one PDF
 */
async function mergeDocumentsToPDF(documents, outputFileName, outputDir = 'temp') {
  try {
    await fs.mkdir(outputDir, { recursive: true });
    const pdfFiles = [];

    for (const doc of documents) {
      let filePath = typeof doc === 'string' ? doc : doc.path || null;
      if (!filePath && doc.buffer && doc.originalname) {
        filePath = path.join(outputDir, `${Date.now()}_${doc.originalname}`);
        await fs.writeFile(filePath, doc.buffer);
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimetype = doc.mimetype || null;
      const tempPdfPath = path.join(outputDir, `${path.basename(filePath, ext)}_temp.pdf`);

      console.log(`[mergeDocumentsToPDF] Processing: ${filePath}`);

      // Skip real PDFs
      if (ext === '.pdf' || mimetype === 'application/pdf') {
        const header = await fs.readFile(filePath, { encoding: null, length: 4 });
        if (header.slice(0, 4).toString() === '%PDF') {
          pdfFiles.push(filePath);
          continue;
        }
      }

      // Convert image to PDF
      const isImage =
        ['.png', '.jpg', '.jpeg'].includes(ext) ||
        ['image/png', 'image/jpeg'].includes(mimetype);

      if (isImage) {
        await imageToPDF(filePath, tempPdfPath);
        pdfFiles.push(tempPdfPath);
        continue;
      }

      // Convert DOCX to PDF
      const isDoc =
        ['.doc', '.docx'].includes(ext) ||
        mimetype?.includes('msword') ||
        mimetype?.includes('officedocument.wordprocessingml.document');

      if (isDoc) {
        await docxToPdfPromise(filePath, tempPdfPath);
        pdfFiles.push(tempPdfPath);
        continue;
      }

      throw new Error(`[mergeDocumentsToPDF] Unsupported file: ${filePath} (${ext})`);
    }

    // Merge all PDFs
    const mergedPdf = await PDFDocument.create();
    for (const pdfPath of pdfFiles) {
      const data = await fs.readFile(pdfPath);
      const doc = await PDFDocument.load(data);
      const pages = await mergedPdf.copyPages(doc, doc.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }

    const finalPath = path.join(outputDir, outputFileName);
    await fs.writeFile(finalPath, await mergedPdf.save());

    // Clean up temp PDFs
    for (const f of pdfFiles) {
      if (f.includes('_temp.pdf')) await fs.unlink(f);
    }

    return finalPath;
  } catch (err) {
    console.error(`[mergeDocumentsToPDF] Failed: ${err.message}`);
    throw err;
  }
}

module.exports = { mergeDocumentsToPDF };

// // 🧪 Test call
// const testFiles = [
//   { path: '../testFileUpload/image1.jpg' },
//   { path: '../testFileUpload/image2.JPG' },
//   { path: '../testFileUpload/image3.docx' }, // optional if testing DOCX
//   '../testFileUpload/already.pdf',           // optional if testing direct PDF
// ];

// mergeDocumentsToPDF(testFiles, 'merged.pdf', outputDir)
//   .then(output => console.log(`✅ Merged PDF created at: ${output}`))
//   .catch(err => console.error(`❌ Error: ${err.message}`));
