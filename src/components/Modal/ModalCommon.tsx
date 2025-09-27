
import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // Optional title for the modal header
  children: ReactNode; // Main content of the modal
  footer?: ReactNode; // Optional footer content
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background',
  borderRadius: "12px",
  boxShadow: 24,
  p: 3,
};

const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div 
          className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-lightmode dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b dark:text-white dark:border-b-gray-900">
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-900"
                  aria-label="Close Modal"
                >
                  ✖
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4">{children}</div>

              {/* Modal Footer */}
              {footer && <div className="p-4 border-t">{footer}</div>}
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ModalComponent;
