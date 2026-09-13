import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Key, Check, Info, ShieldCheck } from 'lucide-react';

export default function SettingsModal({ apiKey, onSave, onClose }) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSave(inputKey.trim());
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setInputKey('');
    onSave('');
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3>AI Configuration (Optional)</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
            StudyFlow AI connects to <strong>Google Gemini API</strong> for real-time generative intelligence.
            If left blank or running offline, our high-fidelity heuristic NLP engine and pre-calibrated sample packs will automatically activate.
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="gemini-key-input" className="field-label">
              Gemini API Key
            </label>
            <input
              id="gemini-key-input"
              type="password"
              className="subject-input"
              style={{ paddingLeft: '14px' }}
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={e => setInputKey(e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
              Stored only in your browser local session. Never exposed publicly.
            </span>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldCheck size={18} style={{ color: '#34D399', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: '#D1FAE5' }}>
              Zero setup required: You can also use the built-in demo packs or drop any lecture PDF right away.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {apiKey && (
              <button 
                type="button" 
                className="btn btn-ghost btn-sm"
                onClick={handleClear}
              >
                Clear Key
              </button>
            )}
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
            >
              {saved ? <Check size={14} /> : null}
              <span>{saved ? 'Saved!' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
