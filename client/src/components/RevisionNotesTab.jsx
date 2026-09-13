import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Hash, 
  CheckSquare, 
  Copy, 
  Check, 
  Calculator, 
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';

export default function RevisionNotesTab({ studyPack, onShowToast }) {
  const [copied, setCopied] = useState(false);

  if (!studyPack) return null;

  const {
    lectureTitle,
    overview,
    keyDefinitions = [],
    coreConcepts = [],
    formulasAndFacts = [],
    takeaways = [],
    pageCount = 1,
    wordCount = 0
  } = studyPack;

  const handleCopyNotes = () => {
    let plainText = `# ${lectureTitle}\n\n`;
    plainText += `## Overview\n${overview}\n\n`;

    if (keyDefinitions.length > 0) {
      plainText += `## Key Definitions\n`;
      keyDefinitions.forEach(d => {
        plainText += `- **${d.term}**: ${d.definition}\n`;
      });
      plainText += `\n`;
    }

    if (coreConcepts.length > 0) {
      plainText += `## Core Concepts\n`;
      coreConcepts.forEach(c => {
        plainText += `### ${c.title}\n`;
        c.points.forEach(p => {
          plainText += `- ${p}\n`;
        });
      });
      plainText += `\n`;
    }

    if (formulasAndFacts.length > 0) {
      plainText += `## Key Formulas & Quantitative Facts\n`;
      formulasAndFacts.forEach(f => {
        plainText += `- **${f.label}**: ${f.formulaOrFact} (${f.explanation})\n`;
      });
      plainText += `\n`;
    }

    if (takeaways.length > 0) {
      plainText += `## Exam Takeaways & Cram Checklist\n`;
      takeaways.forEach(t => {
        plainText += `[ ] ${t}\n`;
      });
    }

    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      if (onShowToast) onShowToast('Revision notes copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="notes-container animate-fade-in">
      {/* Quick Toolbar */}
      <div className="notes-toolbar">
        <div className="notes-stat-group">
          <div className="stat-item">
            <Layers size={15} />
            <span>Pages Analyzed: <strong>{pageCount}</strong></span>
          </div>
          <div className="stat-item">
            <Clock size={15} />
            <span>Est. Revision Time: <strong>~5 mins</strong></span>
          </div>
          <div className="stat-item">
            <Hash size={15} />
            <span>Key Concepts: <strong>{coreConcepts.length}</strong></span>
          </div>
        </div>

        <div className="notes-actions">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleCopyNotes}
            title="Copy notes as formatted markdown"
          >
            {copied ? <Check size={14} style={{ color: '#34D399' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Notes'}</span>
          </button>
        </div>
      </div>

      {/* 1. Overview */}
      <div className="note-section-card">
        <div className="section-header-row">
          <div className="section-icon-pill">
            <BookOpen size={18} />
          </div>
          <h3 className="section-title">Topic Overview</h3>
        </div>
        <p className="overview-text">{overview}</p>
      </div>

      {/* 2. Key Definitions */}
      {keyDefinitions.length > 0 && (
        <div className="note-section-card">
          <div className="section-header-row">
            <div className="section-icon-pill" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA' }}>
              <Sparkles size={18} />
            </div>
            <h3 className="section-title">Key Terminology & Definitions</h3>
          </div>
          <div className="definitions-grid">
            {keyDefinitions.map((def, idx) => (
              <div key={idx} className="definition-card">
                <div className="def-term">{def.term}</div>
                <div className="def-text">{def.definition}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Core Concepts & Bullet Explanations */}
      {coreConcepts.length > 0 && (
        <div className="note-section-card">
          <div className="section-header-row">
            <div className="section-icon-pill" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE' }}>
              <FileText size={18} />
            </div>
            <h3 className="section-title">Core Concepts & Bullet Explanations</h3>
          </div>
          <div className="concepts-list">
            {coreConcepts.map((concept, idx) => (
              <div key={idx} className="concept-item-card">
                <div className="concept-item-title">{concept.title}</div>
                <ul className="concept-points-list">
                  {concept.points.map((pt, pIdx) => (
                    <li key={pIdx} className="concept-bullet-point">{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Formulas and Quantitative Facts */}
      {formulasAndFacts.length > 0 && (
        <div className="note-section-card">
          <div className="section-header-row">
            <div className="section-icon-pill" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
              <Calculator size={18} />
            </div>
            <h3 className="section-title">Important Formulas & Quantitative Facts</h3>
          </div>
          <div className="formulas-list">
            {formulasAndFacts.map((item, idx) => (
              <div key={idx} className="formula-card">
                <div className="formula-label">{item.label}</div>
                <div className="formula-code-box">{item.formulaOrFact}</div>
                <div className="formula-explanation">{item.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Exam Takeaways & Cram Checklist */}
      {takeaways.length > 0 && (
        <div className="note-section-card takeaways-container">
          <div className="section-header-row">
            <div className="section-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
              <CheckSquare size={18} />
            </div>
            <h3 className="section-title">Exam Takeaways & Quick-Cram Checklist</h3>
          </div>
          <div className="takeaway-checklist">
            {takeaways.map((takeaway, idx) => (
              <div key={idx} className="takeaway-item">
                <CheckSquare size={18} className="takeaway-check-icon" />
                <div className="takeaway-text">{takeaway}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
