import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ProcessingScreen from './components/ProcessingScreen';
import ResultsDashboard from './components/ResultsDashboard';
import SettingsModal from './components/SettingsModal';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function App() {
  const [studyPack, setStudyPack] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingFileName, setProcessingFileName] = useState('');
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState(() => {
    return localStorage.getItem('studyflow_gemini_key') || '';
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleSaveApiKey = (newKey) => {
    setUserApiKey(newKey);
    if (newKey) {
      localStorage.setItem('studyflow_gemini_key', newKey);
      showToast('Gemini API key saved!', 'success');
    } else {
      localStorage.removeItem('studyflow_gemini_key');
      showToast('Custom API key cleared. Using smart fallback mode.', 'success');
    }
  };

  // Generate study pack from uploaded PDF
  const handleGenerate = async ({ file, subject }) => {
    setIsLoading(true);
    setProcessingFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);
    if (subject) formData.append('subject', subject);
    if (userApiKey) formData.append('userApiKey', userApiKey);

    try {
      const response = await fetch('/api/extract-and-generate', {
        method: 'POST',
        headers: userApiKey ? { 'x-api-key': userApiKey } : {},
        body: formData
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze the lecture PDF.');
      }

      // Small deliberate delay to allow user to appreciate the multi-stage completion
      setTimeout(() => {
        setStudyPack(data.studyPack);
        setIsLoading(false);
        showToast('Study pack synthesized successfully!', 'success');
      }, 1000);
    } catch (err) {
      console.error('Generation Error:', err);
      setIsLoading(false);
      showToast(err.message || 'An error occurred while analyzing the document.', 'error');
    }
  };

  // Generate study pack from demo presets
  const handleSelectDemo = async (preset = 'cs') => {
    const presetNames = {
      cs: 'CS229_Lecture4_Backprop_DeepLearning.pdf',
      bio: 'BIO110_Lecture6_Cellular_Respiration.pdf',
      econ: 'ECON201_Lecture8_Monetary_Policy_Inflation.pdf'
    };

    setIsLoading(true);
    setProcessingFileName(presetNames[preset] || 'sample_lecture.pdf');

    try {
      const response = await fetch('/api/generate-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load demo study pack.');
      }

      // Slight delay for step animation realism
      setTimeout(() => {
        setStudyPack(data.studyPack);
        setIsLoading(false);
        showToast('Sample study pack loaded!', 'success');
      }, 1500);
    } catch (err) {
      console.error('Demo Error:', err);
      setIsLoading(false);
      showToast(err.message || 'Could not load demo.', 'error');
    }
  };

  const handleReset = () => {
    setStudyPack(null);
    setIsLoading(false);
    setProcessingFileName('');
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Header
        onReset={handleReset}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onTriggerDemo={handleSelectDemo}
        hasStudyPack={Boolean(studyPack)}
        hasCustomKey={Boolean(userApiKey)}
      />

      {/* Main Content Area */}
      <main>
        {isLoading ? (
          <ProcessingScreen fileName={processingFileName} />
        ) : studyPack ? (
          <ResultsDashboard
            studyPack={studyPack}
            onReset={handleReset}
            onShowToast={showToast}
          />
        ) : (
          <UploadZone
            onGenerate={handleGenerate}
            onSelectDemo={handleSelectDemo}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          apiKey={userApiKey}
          onSave={handleSaveApiKey}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-banner ${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle size={18} style={{ color: '#34D399' }} />
          ) : (
            <AlertCircle size={18} style={{ color: '#FB7185' }} />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
