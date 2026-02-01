import React, { useState, useRef } from 'react';
import { Palette, Layout, Type, X, ChevronDown, Check, Download, Upload, FileJson } from 'lucide-react';

export const DesignMenu = ({ config, setConfig, onExport, onImport }) => {
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef(null);

    const colors = [
        { name: 'Charcoal', value: '#1a1a1a' },
        { name: 'Navy', value: '#0f172a' },
        { name: 'Blue', value: '#2563eb' },
        { name: 'Teal', value: '#0d9488' },
        { name: 'Purple', value: '#7c3aed' },
    ];

    const headers = [
        { label: 'Centered', value: 'center' },
        { label: 'Left Aligned', value: 'left' }
    ];

    return (
        <div className="no-print design-menu-container">
            <button
                className={`btn-fab design-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Customize Design"
            >
                {isOpen ? <X size={24} /> : <Palette size={24} />}
            </button>

            {isOpen && (
                <div className="design-panel">
                    <h3>Design Studio</h3>

                    <div className="design-section">
                        <label><FileJson size={14} /> Actions</label>
                        <div className="toggle-group" style={{ gap: '10px', background: 'transparent', padding: 0 }}>
                            <button className="action-btn" onClick={onExport} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                                <Download size={14} /> Backup
                            </button>
                            <button className="action-btn" onClick={() => fileInputRef.current.click()} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                                <Upload size={14} /> Restore
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept=".json"
                                onChange={onImport}
                            />
                        </div>
                    </div>

                    <div className="design-section">
                        <label><Layout size={14} /> Layout</label>
                        <div className="toggle-group">
                            {headers.map(h => (
                                <button
                                    key={h.value}
                                    className={config.headerAlign === h.value ? 'active' : ''}
                                    onClick={() => setConfig({ ...config, headerAlign: h.value })}
                                >
                                    {h.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="design-section">
                        <label><Palette size={14} /> Accent Color</label>
                        <div className="color-grid">
                            {colors.map(c => (
                                <button
                                    key={c.value}
                                    className={`color-btn ${config.accentColor === c.value ? 'active' : ''}`}
                                    style={{ backgroundColor: c.value }}
                                    onClick={() => setConfig({ ...config, accentColor: c.value })}
                                    title={c.name}
                                >
                                    {config.accentColor === c.value && <Check size={12} color="white" strokeWidth={3} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="design-section">
                        <label><Type size={14} /> Divider Style</label>
                        <div className="toggle-group">
                            <button
                                className={config.divider === 'solid' ? 'active' : ''}
                                onClick={() => setConfig({ ...config, divider: 'solid' })}
                            >Solid</button>
                            <button
                                className={config.divider === 'double' ? 'active' : ''}
                                onClick={() => setConfig({ ...config, divider: 'double' })}
                            >Double</button>
                            <button
                                className={config.divider === 'none' ? 'active' : ''}
                                onClick={() => setConfig({ ...config, divider: 'none' })}
                            >None</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
