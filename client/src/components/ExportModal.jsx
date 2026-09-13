import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Sparkles,
  Loader2
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ExportModal({ studyPack, onClose, onShowToast }) {
  const exportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!studyPack) return null;

  const {
    lectureTitle,
    subject = 'General Studies',
    fileName = 'lecture.pdf',
    generatedAt = new Date().toISOString(),
    overview = '',
    keyDefinitions = [],
    coreConcepts = [],
    formulasAndFacts = [],
    takeaways = [],
    practiceQuiz = []
  } = studyPack;

  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleDownloadPdf = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);

    const safeTitle = (lectureTitle || 'StudyFlow_Pack')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const filename = `${safeTitle}_Revision_Pack.pdf`;

    const opt = {
      margin: [12, 12, 12, 12],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(exportRef.current).save();
      if (onShowToast) onShowToast('PDF study pack downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF export failed:', err);
      // Fallback to print
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let doc = `STUDYFLOW AI REVISION PACK\n`;
    doc += `====================================\n`;
    doc += `Subject: ${subject}\n`;
    doc += `Lecture: ${lectureTitle}\n`;
    doc += `Source File: ${fileName}\n`;
    doc += `Generated: ${new Date(generatedAt).toLocaleDateString()}\n\n`;

    doc += `--- REVISION NOTES ---\n\n`;
    doc += `OVERVIEW:\n${overview}\n\n`;

    if (keyDefinitions.length > 0) {
      doc += `KEY DEFINITIONS:\n`;
      keyDefinitions.forEach(d => {
        doc += `• ${d.term}: ${d.definition}\n`;
      });
      doc += `\n`;
    }

    if (coreConcepts.length > 0) {
      doc += `CORE CONCEPTS:\n`;
      coreConcepts.forEach(c => {
        doc += `\n${c.title}:\n`;
        c.points.forEach(p => doc += `  - ${p}\n`);
      });
      doc += `\n`;
    }

    if (formulasAndFacts.length > 0) {
      doc += `FORMULAS & FACTS:\n`;
      formulasAndFacts.forEach(f => {
        doc += `• ${f.label}: ${f.formulaOrFact}\n  ${f.explanation}\n`;
      });
      doc += `\n`;
    }

    if (takeaways.length > 0) {
      doc += `EXAM TAKEAWAYS:\n`;
      takeaways.forEach(t => doc += `[ ] ${t}\n`);
      doc += `\n`;
    }

    doc += `--- 5-QUESTION PRACTICE QUIZ ---\n\n`;
    practiceQuiz.forEach((q, idx) => {
      doc += `Q${idx + 1}. ${q.question}\n`;
      q.options.forEach((opt, oIdx) => {
        doc += `   ${optionLetters[oIdx]}) ${opt}\n`;
      });
      doc += `\n`;
    });

    doc += `--- ANSWER KEY & EXPLANATIONS ---\n\n`;
    practiceQuiz.forEach((q, idx) => {
      doc += `Q${idx + 1} Answer: ${optionLetters[q.correctAnswer]} (${q.options[q.correctAnswer]})\n`;
      doc += `Explanation: ${q.explanation}\n\n`;
    });

    navigator.clipboard.writeText(doc).then(() => {
      setCopied(true);
      if (onShowToast) onShowToast('Full text study pack copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card export-modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3>Export Study Pack</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="export-modal-body">
          {/* Action Toolbar */}
          <div className="export-options-bar">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Complete revision pack with notes, 5-question quiz & answer key.
            </span>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handleCopyText}
              >
                {copied ? <Check size={14} style={{ color: '#34D399' }} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={handlePrint}
              >
                <Printer size={14} />
                <span>Print</span>
              </button>

              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={handleDownloadPdf}
                disabled={isExporting}
              >
                {isExporting ? <Loader2 size={14} className="spinner-icon" /> : <Download size={14} />}
                <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* Printable Layout Preview */}
          <div className="export-preview-wrapper">
            <div ref={exportRef} className="printable-study-pack">
              {/* Header Box */}
              <div className="pack-header-box">
                <div>
                  <div className="pack-brand">StudyFlow AI</div>
                  <div className="pack-tagline">Turn lectures into revision-ready study packs</div>
                </div>
                <div className="pack-meta-box">
                  <div>Source: <strong>{fileName}</strong></div>
                  <div>Date: <strong>{new Date(generatedAt).toLocaleDateString()}</strong></div>
                </div>
              </div>

              {/* Title Block */}
              <div className="pack-title-block">
                <div className="pack-subject">{subject}</div>
                <div className="pack-lecture-title">{lectureTitle}</div>
              </div>

              {/* Section 1: Overview */}
              <div className="pack-section-heading">1. Lecture Overview</div>
              <p className="pack-overview-text">{overview}</p>

              {/* Section 2: Key Definitions */}
              {keyDefinitions.length > 0 && (
                <>
                  <div className="pack-section-heading">2. Key Definitions & Terminology</div>
                  <table className="pack-defs-table">
                    <tbody>
                      {keyDefinitions.map((d, idx) => (
                        <tr key={idx}>
                          <td className="pack-def-term">{d.term}</td>
                          <td>{d.definition}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Section 3: Core Concepts */}
              {coreConcepts.length > 0 && (
                <>
                  <div className="pack-section-heading">3. Core Concepts & Bullet Explanations</div>
                  {coreConcepts.map((concept, idx) => (
                    <div key={idx} className="pack-concept-block">
                      <div className="pack-concept-title">• {concept.title}</div>
                      {concept.points.map((pt, pIdx) => (
                        <div key={pIdx} className="pack-bullet">- {pt}</div>
                      ))}
                    </div>
                  ))}
                </>
              )}

              {/* Section 4: Formulas & Quantitative Facts */}
              {formulasAndFacts.length > 0 && (
                <>
                  <div className="pack-section-heading">4. Formulas & Quantitative Facts</div>
                  {formulasAndFacts.map((f, idx) => (
                    <div key={idx} className="pack-formula-box">
                      <div className="pack-formula-code">{f.label}: {f.formulaOrFact}</div>
                      <div className="pack-formula-desc">{f.explanation}</div>
                    </div>
                  ))}
                </>
              )}

              {/* Section 5: Takeaways */}
              {takeaways.length > 0 && (
                <>
                  <div className="pack-section-heading">5. Exam Takeaways & Cram Checklist</div>
                  {takeaways.map((t, idx) => (
                    <div key={idx} className="pack-takeaway-item">[✓] {t}</div>
                  ))}
                </>
              )}

              {/* Section 6: 5-Question Practice Quiz */}
              <div className="pack-section-heading" style={{ marginTop: '30px' }}>
                6. Practice Quiz (5 Questions)
              </div>
              <p style={{ fontSize: '9pt', color: '#64748B', marginBottom: '14px' }}>
                Answer the following multiple choice questions before checking the answer key at the bottom.
              </p>

              {practiceQuiz.map((q, idx) => (
                <div key={idx} className="pack-quiz-item">
                  <div className="pack-q-text">Q{idx + 1}. {q.question}</div>
                  <div className="pack-options-grid">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="pack-option-box">
                        <strong>{optionLetters[oIdx]}.</strong> {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Section 7: Answer Key & Explanations */}
              <div className="pack-answer-key-box">
                <div className="pack-section-heading" style={{ borderBottomColor: '#10B981', color: '#065F46' }}>
                  7. Answer Key & In-Depth Explanations
                </div>
                {practiceQuiz.map((q, idx) => (
                  <div key={idx} className="pack-answer-row">
                    <div className="pack-answer-title">
                      Question {idx + 1}: Option {optionLetters[q.correctAnswer]} — {q.options[q.correctAnswer]}
                    </div>
                    <div className="pack-answer-exp">
                      <strong>Why: </strong>{q.explanation}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '8pt', color: '#94A3B8', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                StudyFlow AI • Study Pack Generated for Student Revision
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
