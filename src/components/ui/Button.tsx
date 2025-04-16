import React from 'react';

type ButtonProps = {
  text: string;
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      style={{
        padding: '10px 20px',
        backgroundColor: '#0070f3',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
