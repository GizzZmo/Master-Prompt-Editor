import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const style: React.CSSProperties = {
    backgroundColor: variant === 'primary' ? 'var(--primary-color)' : variant === 'secondary' ? 'var(--secondary-color)' : '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out'
  };

  return (
    <button style={style} {...props}>
      {children}
    </button>
  );
};

export default Button;
