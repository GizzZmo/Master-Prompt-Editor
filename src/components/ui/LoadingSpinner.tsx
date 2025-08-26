import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  inline?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#007bff',
  text,
  inline = false,
}) => {
  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px',
  };

  const spinnerSize = sizeMap[size];

  const spinnerStyle: React.CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: `2px solid transparent`,
    borderTop: `2px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const containerStyle: React.CSSProperties = {
    display: inline ? 'inline-flex' : 'flex',
    alignItems: 'center',
    gap: '8px',
    ...(inline ? {} : { justifyContent: 'center', padding: '20px' }),
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={spinnerStyle} aria-hidden="true" />
        {text && (
          <span style={{ color: '#666', fontSize: '14px' }}>
            {text}
          </span>
        )}
      </div>
    </>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  backgroundColor?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  text = 'Loading...',
  backgroundColor = 'rgba(255, 255, 255, 0.9)',
}) => {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <LoadingSpinner size="large" text={text} />
      </div>
    </div>
  );
};

export default LoadingSpinner;