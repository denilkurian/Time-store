import React, { useEffect } from "react";

interface SnackbarProps {
  message: string;
  open?: boolean;
  onClose?: () => void;
  autoHideDuration?: number; // Time in ms to auto-close the snackbar
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  open = false,
  onClose,
  autoHideDuration = 3000, // Default auto-hide duration: 3 seconds
}) => {
  useEffect(() => {
    if (open && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer); // Cleanup timeout on unmount or re-render
    }
  }, [open, onClose, autoHideDuration]);

  return (
    <div
      className={`z-50 fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${open ? "bg-teal-600" : "bg-transparent"
        } transition-all duration-300 ease-in-out ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
        }`}
      role="alert"
      style={{ minWidth: "200px", maxWidth: "400px", textAlign: "center" }}
    >
      {message}
    </div>
  );
};

export default Snackbar;
