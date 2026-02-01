import React, { useState, useEffect, useRef } from 'react';
import { BubbleMenu } from './BubbleMenu';

export const EditableText = ({
    value,
    onSave,
    multiline = false,
    className = "",
    placeholder = "Click to edit",
    html = false
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef(null);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    // Auto-resize textarea
    const adjustHeight = () => {
        if (multiline && inputRef.current && !html) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        if (isEditing) {
            if (inputRef.current && !html) {
                inputRef.current.focus();
                adjustHeight();
            }
        }
    }, [isEditing]);

    const handleBlur = (e) => {
        // Check if clicking inside bubble menu
        if (e.relatedTarget && e.relatedTarget.closest('.bubble-menu')) return;

        setIsEditing(false);
        if (tempValue !== value) {
            onSave(tempValue);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault(); // Prevent newline in single line
            inputRef.current.blur();
        }
    };

    const handleChange = (e) => {
        setTempValue(e.target.value);
        if (multiline) adjustHeight();
    };

    // Rich Text Handling
    const handleFormat = (command) => {
        document.execCommand(command, false, command === 'link' ? prompt('Enter URL:') : null);
        if (inputRef.current) {
            setTempValue(inputRef.current.innerHTML); // Sync state
        }
    };

    if (isEditing) {
        if (html) {
            return (
                <>
                    <BubbleMenu editorRef={inputRef} onFormat={handleFormat} />
                    <div
                        ref={inputRef}
                        className={`editable-input multiline content-editable ${className}`}
                        contentEditable
                        onBlur={(e) => {
                            setTempValue(e.currentTarget.innerHTML);
                            handleBlur(e);
                        }}
                        dangerouslySetInnerHTML={{ __html: tempValue }}
                        style={{ minWidth: '200px', outline: 'none', borderBottom: '1px dashed #ccc' }}
                    />
                </>
            )
        }

        if (multiline) {
            return (
                <textarea
                    ref={inputRef}
                    className={`editable-input multiline ${className}`}
                    value={tempValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    rows={1}
                />
            );
        }
        return (
            <input
                ref={inputRef}
                type="text"
                className={`editable-input ${className}`}
                value={tempValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
            />
        );
    }

    return (
        <span
            className={`editable-display ${className}`}
            onClick={() => setIsEditing(true)}
            title="Click to edit"
        >
            {html ? (
                <span dangerouslySetInnerHTML={{ __html: value || placeholder }} />
            ) : (
                value || <span className="placeholder">{placeholder}</span>
            )}
        </span>
    );
};
