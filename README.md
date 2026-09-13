# StudyFlow AI

> **Turn lectures into revision-ready study packs in seconds.**

[![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vite.dev)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## Problem Statement

Students spend hours manually converting 50–100-slide lecture PDFs into usable revision material before exams. **StudyFlow AI** solves this with one focused, end-to-end workflow:

> Upload a lecture PDF → Extract its content → Generate structured revision notes + a 5-question practice quiz → Review and export a complete study pack.

---

## Features

- **PDF Upload** — Drag-and-drop or click-to-browse. Validates file type (PDF only) and size (≤ 30 MB).
- **5-Stage Processing Animation** — Clear progress screen: Uploading → Reading → Understanding → Generating Notes → Building Quiz.
- **Structured Revision Notes** — Lecture title, overview, key definitions, core concepts, formulas/facts, and exam cram checklist.
- **Interactive 5-MCQ Practice Quiz** — Exactly 5 multiple-choice questions. Client-side scoring, score gauge, colour-coded results, per-question explanations.
- **Export Study Pack** — Full printable export (notes + quiz + answer key) as PDF download, Print, or Copy Plaintext.
- **Demo Mode** — One-click demos with three pre-built lecture packs (Deep Learning, Cellular Respiration, Monetary Policy).
- **Heuristic Fallback** — Fully functional without a Gemini API key using a built-in NLP engine.
- **Optional User API Key** — Supplied at runtime via the settings modal; stored in browser localStorage only, never transmitted to third parties.

---

## Technology Stack

### Backend
| Package | Purpose |
|---|---|
| **Node.js 24** + **Express** | HTTP server and API routing |
| **multer** | Multipart PDF upload handling with type/size validation |
| **unpdf** | Fast PDF text and page extraction |
| **dotenv** | Environment variable management |
| **pdfkit** | Sample lecture PDF generation (dev/demo) |
| **Google Gemini 1.5 Flash API** | Generative structured JSON study pack synthesis |
| **Heuristic NLP Engine** | Rule-based fallback when no API key is configured |

### Frontend
| Package | Purpose |
|---|---|
| **React 18** + **Vite 5** | Component framework and build tooling |
| **Vanilla CSS** | Dark academic theme, glassmorphic cards, micro-animations |
| **lucide-react** | UI icon set |
| **html2pdf.js** | Client-side PDF export of the study pack |
| **canvas-confetti** | Quiz completion celebration animation |

---

## Architecture

```
Browser (React SPA)
    │
    │  POST /api/extract-and-generate  (multipart/form-data: PDF file + subject)
    │  POST /api/generate-demo         (JSON: preset name)
    │  GET  /api/health
    │
    ▼
Express Server  (server/server.js — port 5000)
    │
    ├── pdfExtractor.js  ──  unpdf text extraction + page count
    │
    └── aiGenerator.js
            │
            ├── GEMINI_API_KEY set?
            │       YES → Google Gemini 1.5 Flash API
            │               → structured JSON (notes + 5 MCQs)
            │
            └── NO / API error → Heuristic NLP fallback engine
                        → definition parsing, sentence segmentation,
                          formula detection, content-grounded 5-MCQ builder
```

The frontend **never contacts the Gemini API directly**.  
All AI calls are made server-side using `GEMINI_API_KEY` from the backend environment.

---

## How PDF Processing Works

1. Browser sends the PDF as `multipart/form-data` to `POST /api/extract-and-generate`.
2. **multer** validates file type (PDF MIME) and size (≤ 30 MB), buffers in memory.
3. **pdfExtractor.js** uses **unpdf** to extract plain text and page count.
4. Extracted text is passed to **aiGenerator.js**.
5. If `GEMINI_API_KEY` is set → Gemini 1.5 Flash returns validated JSON with exactly 5 MCQs.
6. If no key or API failure → heuristic NLP engine produces grounded notes and a quiz.
7. The completed study pack JSON is returned to the frontend and rendered in the Results Dashboard.

---

## How Gemini Is Used

- **Model**: `gemini-1.5-flash`
- **Endpoint**: `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Response MIME**: `application/json` (enforces structured output)
- **Temperature**: 0.25 (grounded, factual)
- **Prompt strategy**: Full lecture text with strict grounding instructions — no hallucination. Returns `lectureTitle`, `overview`, `keyDefinitions`, `coreConcepts`, `formulasAndFacts`, `takeaways`, and exactly 5 `practiceQuiz` items.

---

## Local Setup

### Prerequisites
- **Node.js 18+** (tested on v24)
- Optional: Gemini API key from [aistudio.google.com](https://aistudio.google.com/app/apikey)

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/studyflow-ai.git
cd studyflow-ai
```

### 2. Install all dependencies

```bash
npm run install:all
```

### 3. Configure environment variables

```bash
cp .env.example .env   # or: copy .env.example .env  (Windows)
```

Edit `.env`:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Build frontend + generate sample PDFs

```bash
npm run build
```

### 5. Start the unified server

```bash
npm start
```

Open **http://localhost:5000** — Express serves both the API and the React SPA.

---

## Development Mode (Hot Reload)

**Terminal 1 — Backend:**
```bash
npm run dev:server
```

**Terminal 2 — Frontend:**
```bash
npm run dev:client
```

Open **http://localhost:5173**. Vite proxies `/api` calls to `localhost:5000`.

---

## Start Commands

| Mode | Command |
|---|---|
| **Backend (production)** | `npm start` |
| **Backend (development)** | `npm run dev:server` |
| **Frontend (development)** | `npm run dev:client` |
| **Frontend (production build)** | `npm run build` |
| **Install all deps** | `npm run install:all` |

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Express server port |
| `GEMINI_API_KEY` | Optional | *(empty)* | Google Gemini API key. If omitted, the heuristic NLP engine activates. Get one at [aistudio.google.com](https://aistudio.google.com/app/apikey) |

> ⚠️ **Never commit your real `.env` file.** Only `.env.example` belongs in version control.

---

## Project Structure

```
studyflow-ai/
├── client/                         # Vite + React frontend
│   ├── dist/                       # Production build (served by Express)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── UploadZone.jsx
│   │   │   ├── ProcessingScreen.jsx
│   │   │   ├── ResultsDashboard.jsx
│   │   │   ├── RevisionNotesTab.jsx
│   │   │   ├── PracticeQuizTab.jsx
│   │   │   ├── ExportModal.jsx
│   │   │   └── SettingsModal.jsx
│   │   ├── styles/
│   │   │   ├── theme.css
│   │   │   ├── app.css
│   │   │   ├── upload.css
│   │   │   ├── processing.css
│   │   │   ├── notes.css
│   │   │   ├── quiz.css
│   │   │   └── export.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                         # Express backend
│   ├── data/
│   │   └── samplePacks.js          # Pre-built demo study packs
│   ├── samplePdfs/                 # Generated sample lecture PDFs
│   ├── scripts/
│   │   └── generateSamplePdfs.js   # PDFKit script to create sample PDFs
│   ├── services/
│   │   ├── pdfExtractor.js         # PDF text extraction (unpdf)
│   │   └── aiGenerator.js          # Gemini API + heuristic fallback
│   ├── server.js                   # Express app + API endpoints
│   └── package.json
│
├── .env.example                    # Environment variable template (commit this)
├── .gitignore                      # Excludes .env, node_modules, dist, etc.
├── package.json                    # Root orchestration scripts
└── README.md
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check; reports `hasApiKey` |
| `POST` | `/api/extract-and-generate` | Upload PDF, extract text, return study pack |
| `POST` | `/api/generate-demo` | Load a pre-built demo pack (`preset`: cs/bio/econ) |
| `GET` | `/api/sample-pdf/:id` | Download a sample lecture PDF |

---

## Deployment

### Option A — Single-server (recommended)

1. Build: `npm run build`
2. Set `GEMINI_API_KEY` as an environment variable on your host.
3. Start: `npm start`
4. Express serves both the API and the React SPA at the same port.

### Option B — Separate services

- Deploy **`server/`** to any Node.js host (Render, Railway, Fly.io)
- Deploy **`client/dist/`** (static files) to a CDN (Netlify, Vercel, Cloudflare Pages)
- Configure CORS on the backend and set the API base URL in the frontend

### Security checklist before going live

- [ ] `.env` is in `.gitignore` and not committed
- [ ] `GEMINI_API_KEY` is a server-side environment variable only
- [ ] No API keys in frontend source code or in the compiled `dist/` output
- [ ] `npm audit` shows no critical vulnerabilities

---

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: StudyFlow AI"
git remote add origin https://github.com/YOUR_USERNAME/studyflow-ai.git
git branch -M main
git push -u origin main
```

---

## Limitations

- **Image-only PDFs**: Scanned documents without embedded text extract minimal content; heuristic questions will be generic.
- **File size**: Maximum 30 MB per upload.
- **Gemini quota**: Subject to Google AI Studio free-tier rate limits. Heuristic fallback activates automatically if the API is unavailable.
- **Heuristic quality**: Gemini mode produces higher-quality, topic-specific output than the heuristic fallback for all domains.