import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { extractPdfContent } from './services/pdfExtractor.js';
import { generateStudyPack } from './services/aiGenerator.js';
import { samplePacks } from './data/samplePacks.js';

// Load .env from workspace root or current dir
const rootEnvPath = path.resolve(process.cwd(), '.env');
const parentEnvPath = path.resolve(process.cwd(), '..', '.env');
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else if (fs.existsSync(parentEnvPath)) {
  dotenv.config({ path: parentEnvPath });
} else {
  dotenv.config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Multer in-memory storage for handling PDF uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024 // 30 MB limit
  },
  fileFilter: (req, file, cb) => {
    const isPdfMime = file.mimetype === 'application/pdf';
    const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';
    if (isPdfMime || isPdfExt) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type: Please upload a valid PDF lecture document (.pdf).'));
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'StudyFlow AI Backend',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Demo pack endpoint
app.post('/api/generate-demo', (req, res) => {
  try {
    const { preset = 'cs' } = req.body;
    const pack = samplePacks[preset] || samplePacks.cs;
    res.json({
      success: true,
      studyPack: pack
    });
  } catch (err) {
    console.error('Demo generation error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate demo study pack'
    });
  }
});

// Download sample PDF endpoint for testing real uploads
app.get('/api/sample-pdf/:id', (req, res) => {
  const fileMap = {
    cs: 'CS229_Lecture4_Backprop_DeepLearning.pdf',
    bio: 'BIO110_Lecture6_Cellular_Respiration.pdf',
    econ: 'ECON201_Lecture8_Monetary_Policy_Inflation.pdf'
  };

  const filename = fileMap[req.params.id] || fileMap.cs;
  const filePath = path.join(__dirname, 'samplePdfs', filename);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).json({ error: 'Sample PDF not found' });
  }
});

// Main upload, extraction and generation endpoint
app.post('/api/extract-and-generate', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file was uploaded. Please select or drop a lecture PDF.'
      });
    }

    const { subject = '', userApiKey = '' } = req.body;
    const fileName = req.file.originalname;
    const fileSizeFormatted = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;

    console.log(`[StudyFlow AI] Processing PDF "${fileName}" (${fileSizeFormatted})...`);

    // Step 1: Extract text from PDF buffer
    const { text, pageCount, wordCount } = await extractPdfContent(req.file.buffer);
    console.log(`[StudyFlow AI] Extracted ${pageCount} pages, ${wordCount} words.`);

    // Step 2: Generate Study Pack (AI or Heuristic NLP)
    const studyPack = await generateStudyPack({
      text,
      subject,
      fileName,
      userApiKey: userApiKey || req.headers['x-api-key']
    });

    // Update with exact file metadata
    studyPack.fileName = fileName;
    studyPack.fileSize = fileSizeFormatted;
    studyPack.pageCount = pageCount;
    studyPack.wordCount = wordCount;

    res.json({
      success: true,
      studyPack
    });
  } catch (err) {
    console.error('[StudyFlow AI] Error processing study pack:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'An unexpected error occurred while processing the lecture.'
    });
  }
});

// Error handling middleware for Multer and general errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size limit exceeded. Please upload a PDF under 30MB.'
      });
    }
    return res.status(400).json({ success: false, error: err.message });
  } else if (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
  next();
});

// Serve client in production if built
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  StudyFlow AI Server running on http://localhost:${PORT}`);
  console.log(`========================================`);
});
