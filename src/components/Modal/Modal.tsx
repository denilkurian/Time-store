import React, { ReactNode } from 'react';



// Generic Modal Component

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
}


const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">

      {children}

    </div>


  );
};

export default Modal;
