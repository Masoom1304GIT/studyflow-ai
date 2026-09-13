import React from 'react';
import { Sparkles, Key, RotateCcw, PlayCircle, BookOpen } from 'lucide-react';

export default function Header({ 
  onReset, 
  onOpenSettings, 
  onTriggerDemo, 
  hasStudyPack, 
  hasCustomKey 
}) {
  return (
    <header className="app-header">
      <div className="brand-wrapper" onClick={onReset} title="StudyFlow AI Home">
        <div className="brand-icon-box">
          <BookOpen size={24} />
        </div>
        <div className="brand-text">
          <h1>StudyFlow AI</h1>
          <p className="brand-tagline">Turn lectures into revision-ready study packs</p>
        </div>
      </div>

      <div className="header-actions">
        {!hasStudyPack && (
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={() => onTriggerDemo('cs')}
            title="Try Demo with sample lecture"
          >
            <PlayCircle size={16} />
            <span>Try Demo</span>
          </button>
        )}

        {hasStudyPack && (
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onReset}
            title="Upload another lecture PDF"
          >
            <RotateCcw size={16} />
            <span>New Lecture</span>
          </button>
        )}

        <button 
          type="button" 
          className="btn btn-ghost btn-sm"
          onClick={onOpenSettings}
          title="Configure API Key (Optional)"
        >
          <Key size={16} />
          <span>API Key</span>
          {hasCustomKey && <span className="badge badge-emerald" style={{ padding: '1px 6px', fontSize: '0.65rem' }}>Active</span>}
        </button>
      </div>
    </header>
  );
}
