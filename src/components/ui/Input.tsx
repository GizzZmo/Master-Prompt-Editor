import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div style={{ marginBottom: '15px' }}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} type="text" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} {...props} />
    </div>
  );
};

export default Input;
