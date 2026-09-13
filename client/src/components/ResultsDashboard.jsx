import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  Download, 
  RotateCcw, 
  CheckCircle, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Hash,
  ExternalLink
} from 'lucide-react';
import RevisionNotesTab from './RevisionNotesTab';
import PracticeQuizTab from './PracticeQuizTab';
import ExportModal from './ExportModal';

export default function ResultsDashboard({ 
  studyPack, 
  onReset, 
  onShowToast 
}) {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'quiz'
  const [showExportModal, setShowExportModal] = useState(false);
  const [quizScore, setQuizScore] = useState(null); // { score, total }

  if (!studyPack) return null;

  const {
    lectureTitle,
    subject,
    fileName,
    fileSize,
    pageCount = 1,
    practiceQuiz = []
  } = studyPack;

  const handleQuizCompleted = (score, total) => {
    setQuizScore({ score, total });
  };

  return (
    <div className="results-workspace animate-fade-in">
      {/* Top Banner & Metadata */}
      <div className="results-header-card" style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }}>
        {/* Status Indicator Chip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-emerald">
              <CheckCircle size={13} /> Generated from Lecture
            </span>
            <span className="badge badge-indigo">
              {subject || 'General Studies'}
            </span>
            <span className="badge badge-cyan" title="Source document">
              <FileText size={13} /> {fileName} ({fileSize || 'PDF'})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onReset}
            >
              <RotateCcw size={14} />
              <span>New Lecture</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowExportModal(true)}
            >
              <Download size={14} />
              <span>Export Study Pack</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.85rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1.25,
          marginBottom: '6px'
        }}>
          {lectureTitle}
        </h2>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          High-yield synthesis extracted from {pageCount} lecture slide{pageCount > 1 ? 's' : ''}. Switch between Revision Notes and the 5-Question Quiz below.
        </p>

        {/* Tab Switcher Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          marginTop: '24px',
          paddingBottom: '0px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'notes' ? '3px solid var(--accent-primary)' : '3px solid transparent',
              color: activeTab === 'notes' ? '#FFFFFF' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <BookOpen size={18} style={{ color: activeTab === 'notes' ? 'var(--accent-primary)' : 'inherit' }} />
            <span>Revision Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'quiz' ? '3px solid var(--accent-primary)' : '3px solid transparent',
              color: activeTab === 'quiz' ? '#FFFFFF' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <HelpCircle size={18} style={{ color: activeTab === 'quiz' ? 'var(--accent-primary)' : 'inherit' }} />
            <span>Practice Quiz (5 MCQs)</span>
            {quizScore ? (
              <span className={`badge ${quizScore.score >= 4 ? 'badge-emerald' : 'badge-indigo'}`} style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                Score: {quizScore.score}/{quizScore.total}
              </span>
            ) : (
              <span className="badge badge-indigo" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                Interactive
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === 'notes' ? (
        <RevisionNotesTab studyPack={studyPack} onShowToast={onShowToast} />
      ) : (
        <PracticeQuizTab quiz={practiceQuiz} onQuizCompleted={handleQuizCompleted} />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          studyPack={studyPack}
          onClose={() => setShowExportModal(false)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}
