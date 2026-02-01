import React, { useEffect, useState } from 'react';
import { Bold, Italic, Link2, X } from 'lucide-react';

export const BubbleMenu = ({ editorRef, onFormat }) => {
    const [position, setPosition] = useState(null);

    useEffect(() => {
        const handleSelect = () => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) {
                setPosition(null);
                return;
            }

            // Only show if selection is inside our editor
            if (!editorRef.current.contains(selection.anchorNode)) return;

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setPosition({
                top: rect.top - 40,
                left: rect.left + (rect.width / 2) - 60 // Center the 120px wide menu
            });
        };

        document.addEventListener('selectionchange', handleSelect);
        return () => document.removeEventListener('selectionchange', handleSelect);
    }, [editorRef]);

    if (!position) return null;

    return (
        <div className="bubble-menu-portal" style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 1000
        }}>
            <div className="bubble-menu">
                <button onClick={() => onFormat('bold')} title="Bold"><Bold size={14} /></button>
                <button onClick={() => onFormat('italic')} title="Italic"><Italic size={14} /></button>
                <button onClick={() => onFormat('link')} title="Link"><Link2 size={14} /></button>
            </div>
        </div>
    );
};
