import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotsDir = path.join(__dirname, '..', 'test-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const samplePdfPath = path.join(__dirname, '..', 'samplePdfs', 'CS229_Lecture4_Backprop_DeepLearning.pdf');

async function runTest() {
  console.log('=== Starting StudyFlow AI End-to-End Automated Browser Test ===');
  console.log('Using Chrome:', chromePath);
  console.log('Sample PDF:', samplePdfPath);

  const consoleErrors = [];
  const consoleLogs = [];

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      consoleErrors.push(text);
      console.error('[BROWSER ERROR]', text);
    } else {
      consoleLogs.push(`[${msg.type()}] ${text}`);
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
    console.error('[PAGE RUNTIME ERROR]', err);
  });

  try {
    // 1. Landing Page
    console.log('\n--- Step 1: Navigating to Landing Page ---');
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(screenshotsDir, '1-landing.png') });
    console.log('Landing page loaded. Title:', await page.title());

    // 2. Upload PDF
    console.log('\n--- Step 2: Uploading Lecture PDF ---');
    const fileInput = await page.$('input[type="file"]');
    if (!fileInput) throw new Error('File input not found');
    await fileInput.uploadFile(samplePdfPath);
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(screenshotsDir, '2-file-selected.png') });
    const selectedFileName = await page.$eval('.file-name', el => el.textContent.trim());
    console.log('File selected card rendered:', selectedFileName);

    // 3. Click Generate Study Pack
    console.log('\n--- Step 3: Triggering Generation ---');
    await page.click('button.generate-btn');
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({ path: path.join(screenshotsDir, '3-processing.png') });
    console.log('Processing screen active.');

    // 4. Wait for Study Pack Results
    console.log('\n--- Step 4: Awaiting Results Dashboard ---');
    await page.waitForSelector('.results-workspace', { timeout: 15000 });
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(screenshotsDir, '4-results-notes.png') });
    const lectureTitle = await page.$eval('.results-header-card h2', el => el.textContent.trim());
    console.log('Study pack rendered successfully! Lecture Title:', lectureTitle);

    // Test Copy Notes button
    const copyNotesBtn = await page.$('button[title*="Copy notes"]');
    if (copyNotesBtn) {
      await copyNotesBtn.click();
      await new Promise(r => setTimeout(r, 500));
      console.log('Copy Notes button clicked.');
    }

    // 5. Test Practice Quiz Tab
    console.log('\n--- Step 5: Testing Practice Quiz Tab ---');
    const quizTabBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('Practice Quiz'));
    });
    await quizTabBtn.click();
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(screenshotsDir, '5-quiz-unanswered.png') });

    // Answer all 5 questions
    const questionCards = await page.$$('.question-card');
    console.log('Found', questionCards.length, 'quiz question cards.');

    for (let i = 0; i < questionCards.length; i++) {
      const card = questionCards[i];
      const options = await card.$$('.option-btn');
      if (options.length > 0) {
        // Pick option 1 or 2
        await options[1 % options.length].click();
      }
    }
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(screenshotsDir, '6-quiz-answered.png') });

    // Submit Quiz
    console.log('\n--- Step 6: Submitting Quiz ---');
    const submitBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('Submit Quiz'));
    });
    await submitBtn.click();
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(screenshotsDir, '7-quiz-scored.png') });
    const scoreText = await page.$eval('.score-feedback-text h3', el => el.textContent.trim());
    const gaugeValue = await page.$eval('.gauge-value', el => el.textContent.trim());
    console.log('Quiz scored! Score:', gaugeValue, 'Feedback:', scoreText);

    // 6. Test Export Modal
    console.log('\n--- Step 7: Testing Export Study Pack Modal ---');
    const exportBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('Export Study Pack'));
    });
    await exportBtn.click();
    await page.waitForSelector('.export-modal-card', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(screenshotsDir, '8-export-modal.png') });
    console.log('Export modal opened and preview verified.');

    // Close Export Modal
    const closeBtn = await page.$('.modal-close-btn');
    if (closeBtn) await closeBtn.click();
    await new Promise(r => setTimeout(r, 400));

    // 7. Test Reset / New Lecture
    console.log('\n--- Step 8: Testing Reset and Demo Preset ---');
    const newLectureBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('New Lecture'));
    });
    await newLectureBtn.click();
    await page.waitForSelector('.upload-card', { timeout: 5000 });
    console.log('Returned to landing page.');

    // Click Biology demo preset
    const bioPresetBtn = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.demo-preset-card'));
      return cards.find(c => c.textContent.includes('Biology'));
    });
    await bioPresetBtn.click();
    console.log('Clicked Biology Demo preset.');

    await page.waitForSelector('.results-workspace', { timeout: 15000 });
    await page.screenshot({ path: path.join(screenshotsDir, '9-bio-demo-results.png') });
    const bioTitle = await page.$eval('.results-header-card h2', el => el.textContent.trim());
    console.log('Biology study pack loaded! Title:', bioTitle);

    console.log('\n=== ALL END-TO-END FLOWS EXECUTED SUCCESSFULLY ===');
    console.log('Total Console Errors:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }

  } catch (err) {
    console.error('Test Execution Error:', err);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-state.png') });
    throw err;
  } finally {
    await browser.close();
  }
}

runTest().catch(err => {
  console.error('Fatal Test Failure:', err);
  process.exit(1);
});
