import React, { useState, useEffect } from 'react';
import { initialData } from './data/initialData';
import { CVPreview } from './components/Preview/CVPreview';
import { DesignMenu } from './components/UI/DesignMenu';
import './styles/main.css';

function App() {
  // Initialize from LocalStorage or Default
  const [cvData, setCvData] = useState(() => {
    const saved = localStorage.getItem('cv_data');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('cv_config');
    return saved ? JSON.parse(saved) : {
      headerAlign: 'center',
      accentColor: '#1a1a1a',
      divider: 'solid'
    };
  });

  // Auto-Save
  useEffect(() => {
    localStorage.setItem('cv_data', JSON.stringify(cvData));
    localStorage.setItem('cv_config', JSON.stringify(config));
  }, [cvData, config]);

  // File Handlers
  const handleExport = () => {
    const dataStr = JSON.stringify({ cvData, config }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cv-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.cvData) setCvData(imported.cvData);
        if (imported.config) setConfig(imported.config);
        alert('Backup loaded successfully!');
      } catch (err) {
        alert('Failed to load file. Invalid format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-container" style={{
      '--cv-accent': config.accentColor,
      '--cv-align': config.headerAlign
    }}>
      <DesignMenu
        config={config}
        setConfig={setConfig}
        onExport={handleExport}
        onImport={handleImport}
      />
      <div className="preview-pane">
        <CVPreview data={cvData} setData={setCvData} config={config} />
      </div>
    </div>
  );
}

export default App;
