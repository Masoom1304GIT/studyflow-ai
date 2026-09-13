import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  HelpCircle, 
  ArrowRight,
  Download,
  Lightbulb
} from 'lucide-react';

export default function UploadZone({ 
  onGenerate, 
  onSelectDemo, 
  isLoading 
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const subjectPresets = [
    'CS 229: Deep Learning',
    'BIO 110: Biochemistry',
    'ECON 201: Macroeconomics',
    'PHYS 101: Mechanics'
  ];

  const validateAndSetFile = (file) => {
    setErrorMessage('');
    if (!file) return;

    // Validate PDF
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setErrorMessage('Please upload a valid PDF document (.pdf). Other formats are not supported.');
      return;
    }

    // Validate size (max 30MB)
    if (file.size > 30 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 30MB limit. Please upload a smaller lecture PDF.');
      return;
    }

    if (file.size < 100) {
      setErrorMessage('The selected file appears to be empty or corrupted.');
      return;
    }

    setSelectedFile(file);

    // If subject is empty, try to auto-infer from filename
    if (!subject) {
      const cleanName = file.name
        .replace(/\.pdf$/i, '')
        .replace(/[_\-]+/g, ' ')
        .trim();
      if (cleanName.length > 3) {
        setSubject(cleanName.slice(0, 35));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please choose or drop a lecture PDF first.');
      return;
    }
    onGenerate({ file: selectedFile, subject });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="upload-workspace animate-fade-in">
      {/* Hero Header */}
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={14} />
          <span>Focused Student Exam Revision</span>
        </div>
        <h2 className="hero-title">
          Turn lectures into <span>revision-ready study packs</span>
        </h2>
        <p className="hero-subtitle">
          Upload any lecture slides or textbook PDF. StudyFlow AI extracts core concepts,
          condenses high-yield revision notes, and generates an interactive 5-question practice quiz instantly.
        </p>
      </section>

      {/* Main Upload Box */}
      <div className="upload-card">
        <form onSubmit={handleSubmit}>
          {/* Subject Field */}
          <div className="subject-field-group">
            <label htmlFor="subject-input" className="field-label">
              Course or Subject Name <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
            </label>
            <div className="subject-input-wrapper">
              <BookOpen size={18} className="subject-input-icon" />
              <input
                id="subject-input"
                type="text"
                className="subject-input"
                placeholder="e.g. CS 229: Deep Learning, or Bio 110"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={60}
              />
            </div>
            <div className="subject-chips">
              <span className="chip-label">Suggestions:</span>
              {subjectPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="chip-btn"
                  onClick={() => setSubject(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          {!selectedFile ? (
            <div
              className={`dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <div className="dropzone-content">
                <div className="dropzone-icon-box">
                  <UploadCloud size={32} />
                </div>
                <div className="dropzone-title">
                  Choose a lecture PDF or drag & drop here
                </div>
                <div className="dropzone-subtitle">
                  Supports lecture slides, chapters, or syllabus PDFs (up to 30 MB)
                </div>
                <div className="dropzone-note">
                  PDF format only • 100% processed securely
                </div>
              </div>
            </div>
          ) : (
            <div className="file-selected-card">
              <div className="file-info-group">
                <div className="file-pdf-icon">
                  <FileText size={26} />
                </div>
                <div className="file-meta">
                  <div className="file-name" title={selectedFile.name}>
                    {selectedFile.name}
                  </div>
                  <div className="file-details">
                    <span>{formatFileSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span className="file-status-badge">
                      <CheckCircle size={14} /> Ready to analyze
                    </span>
                  </div>
                </div>
              </div>

              <div className="file-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                  title="Replace file"
                >
                  Replace
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleRemoveFile}
                  title="Remove file"
                  style={{ color: '#FB7185' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Validation Error */}
          {errorMessage && (
            <div className="upload-error animate-fade-in">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* CTA Action */}
          <div className="upload-cta-area">
            <button
              type="submit"
              disabled={!selectedFile || isLoading}
              className="btn btn-primary btn-lg generate-btn"
            >
              <Sparkles size={18} />
              <span>Generate Study Pack</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Demo Presets Section */}
          <div className="demo-divider">
            <span>Or try an instant sample lecture</span>
          </div>

          <div className="demo-presets-row">
            <button
              type="button"
              className="demo-preset-card"
              onClick={() => onSelectDemo('cs')}
            >
              <div className="preset-badge">Computer Science</div>
              <div className="preset-title">Neural Networks & Backpropagation</div>
              <div className="preset-pages">28 slides • Gradients, activations, MLP</div>
            </button>

            <button
              type="button"
              className="demo-preset-card"
              onClick={() => onSelectDemo('bio')}
            >
              <div className="preset-badge" style={{ color: '#34D399' }}>Biology</div>
              <div className="preset-title">Cellular Respiration & ATP</div>
              <div className="preset-pages">32 slides • Glycolysis, Krebs, ETC</div>
            </button>

            <button
              type="button"
              className="demo-preset-card"
              onClick={() => onSelectDemo('econ')}
            >
              <div className="preset-badge" style={{ color: '#38BDF8' }}>Economics</div>
              <div className="preset-title">Inflation & Monetary Policy</div>
              <div className="preset-pages">24 slides • Central banking, Taylor rule</div>
            </button>
          </div>

          {/* Sample PDF Download Helper */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Need a test PDF to drag and drop?{' '}
              <a 
                href="/api/sample-pdf/cs" 
                download 
                style={{ color: '#818CF8', textDecoration: 'underline', marginLeft: '4px' }}
              >
                Download Sample CS Lecture PDF
              </a>
            </span>
          </div>
        </form>
      </div>

      {/* Feature Value Cards */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-box notes">
            <BookOpen size={22} />
          </div>
          <div className="feature-content">
            <h3>Structured Revision Notes</h3>
            <p>
              Extracts topic overviews, key terminology, formula callouts, and bullet-point explanations organized for rapid exam cramming.
            </p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon-box quiz">
            <HelpCircle size={22} />
          </div>
          <div className="feature-content">
            <h3>5-Question Practice Quiz</h3>
            <p>
              Tests active recall with 4-option multiple-choice questions grounded in the lecture, complete with instant scoring and detailed answer keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
