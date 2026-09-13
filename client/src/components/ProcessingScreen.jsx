import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileSearch, 
  BrainCircuit, 
  FileText, 
  CheckCircle2, 
  Loader2,
  Sparkles 
} from 'lucide-react';

export default function ProcessingScreen({ fileName, isDemo = false }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);

  const steps = [
    { id: 'upload', label: 'Uploading lecture document', icon: UploadCloud },
    { id: 'extract', label: 'Reading lecture & extracting text', icon: FileSearch },
    { id: 'understand', label: 'Understanding core topics & key concepts', icon: BrainCircuit },
    { id: 'notes', label: 'Generating condensed revision notes', icon: FileText },
    { id: 'quiz', label: 'Creating 5-question practice quiz', icon: Sparkles }
  ];

  useEffect(() => {
    // Progressive simulated step transitions matching typical backend processing latency
    const timers = [
      setTimeout(() => { setCurrentStepIndex(1); setProgressPercent(35); }, 800),
      setTimeout(() => { setCurrentStepIndex(2); setProgressPercent(60); }, 1800),
      setTimeout(() => { setCurrentStepIndex(3); setProgressPercent(80); }, 2800),
      setTimeout(() => { setCurrentStepIndex(4); setProgressPercent(94); }, 3800)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="processing-container">
      <div className="processing-header">
        <h2 className="processing-title">Synthesizing Your Study Pack</h2>
        <p className="processing-subtitle">
          Analyzing <strong>{fileName || 'lecture document'}</strong> and crafting exam-ready revision material...
        </p>
      </div>

      {/* Progress Track */}
      <div className="progress-track-wrapper">
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="progress-percentage">
          <span>{progressPercent}% Complete</span>
        </div>
      </div>

      {/* 5-Step Process Timeline */}
      <div className="steps-list">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <div 
              key={step.id} 
              className={`step-row ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="step-icon-circle">
                {isCompleted ? (
                  <CheckCircle2 size={18} />
                ) : isActive ? (
                  <Loader2 size={18} className="spinner-icon" />
                ) : (
                  <StepIcon size={16} />
                )}
              </div>

              <div className="step-text-wrap">
                <div className="step-name">{step.label}</div>
              </div>

              <div className="step-status-tag">
                {isCompleted && 'Done'}
                {isActive && 'In Progress...'}
                {isPending && 'Queued'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
