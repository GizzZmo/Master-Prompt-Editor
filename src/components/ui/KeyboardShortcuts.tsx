import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface KeyboardShortcut {
  key: string;
  description: string;
  action?: () => void;
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ shortcuts }) => {
  const [isVisible, setIsVisible] = useState(false);

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const matchesShortcut = useCallback((event: KeyboardEvent, shortcutKey: string): boolean => {
    const keys = shortcutKey.toLowerCase().split('+');
    const hasCtrl = keys.includes('ctrl') && (event.ctrlKey || event.metaKey);
    const hasShift = keys.includes('shift') && event.shiftKey;
    const hasAlt = keys.includes('alt') && event.altKey;
    const key = keys[keys.length - 1];

    return (
      (!keys.includes('ctrl') || hasCtrl) &&
      (!keys.includes('shift') || hasShift) &&
      (!keys.includes('alt') || hasAlt) &&
      event.key.toLowerCase() === key
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle escape key to close modal
      if (event.key === 'Escape' && isVisible) {
        event.preventDefault();
        closeModal();
        return;
      }

      // Show shortcuts help with Ctrl+/ or Cmd+/
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        toggleModal();
        return;
      }

      // Execute shortcuts (only when modal is not visible to avoid conflicts)
      if (!isVisible) {
        shortcuts.forEach(shortcut => {
          if (matchesShortcut(event, shortcut.key)) {
            event.preventDefault();
            shortcut.action?.();
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, isVisible, matchesShortcut, closeModal, toggleModal]);

  // Memoize platform detection for better performance
  const isMac = useMemo(() => navigator.platform.includes('Mac'), []);

  const formatShortcut = useCallback((shortcut: string): string => {
    return shortcut
      .split('+')
      .map(key => {
        switch (key.toLowerCase()) {
          case 'ctrl':
            return isMac ? '⌘' : 'Ctrl';
          case 'shift':
            return '⇧';
          case 'alt':
            return isMac ? '⌥' : 'Alt';
          case 'enter':
            return '↵';
          default:
            return key.toUpperCase();
        }
      })
      .join(' + ');
  }, [isMac]);

  if (!isVisible) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          zIndex: 999,
          cursor: 'pointer',
        }}
        onClick={toggleModal}
        onKeyDown={(e) => e.key === 'Enter' && toggleModal()}
        title="Show keyboard shortcuts"
        role="button"
        tabIndex={0}
      >
        Press {isMac ? '⌘' : 'Ctrl'} + / for shortcuts
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
        onClick={closeModal}
        aria-hidden="true"
      />
      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          zIndex: 1001,
        }}
        role="dialog"
        aria-labelledby="shortcuts-title"
        aria-modal="true"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 id="shortcuts-title" style={{ margin: 0, color: '#333' }}>Keyboard Shortcuts</h3>
          <button
            onClick={closeModal}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
            }}
            aria-label="Close shortcuts help"
            type="button"
          >
            ×
          </button>
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
          {shortcuts.map((shortcut, index) => (
            <div
              key={`${shortcut.key}-${index}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: index < shortcuts.length - 1 ? '1px solid #f0f0f0' : 'none',
              }}
            >
              <span style={{ color: '#555' }}>{shortcut.description}</span>
              <div
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#333',
                }}
              >
                {formatShortcut(shortcut.key)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default KeyboardShortcuts;