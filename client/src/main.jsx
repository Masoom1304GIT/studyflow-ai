import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import './styles/theme.css';
import './styles/app.css';
import './styles/upload.css';
import './styles/processing.css';
import './styles/notes.css';
import './styles/quiz.css';
import './styles/export.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
