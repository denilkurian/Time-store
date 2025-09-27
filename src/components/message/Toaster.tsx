import React from 'react';
import { useEffect } from 'react';


interface ToasterMessageProps {
  message: string;
  type: 'success' | 'error' | 'info';
  closeToast: () => void; // Function to close the toaster
}

const ToasterMessage: React.FC<ToasterMessageProps> = ({ message, type, closeToast }) => {
  const getColor = () => {
    switch (type) {
      case 'success':
        return 'green';
      case 'error':
        return '#d45f5f';
      case 'info':
        return 'blue';
      default:
        return 'gray';
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      closeToast();
    }, 5000);

    return () => clearTimeout(timer);
  }, [closeToast]);


  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: getColor(),
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        maxWidth: '400px',
        margin: '10px auto',
      }}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'white',
          marginRight: '10px',
        }}
      />
      <span>{message}</span>
      <button
        onClick={closeToast}
        style={{
          marginLeft: 'auto',
          background: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default ToasterMessage;
