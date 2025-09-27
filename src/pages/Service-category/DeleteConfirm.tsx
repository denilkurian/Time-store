import React, { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import useCustomToast from "../../hooks/useCustomToast"; 
import Button from "../../components/Button/Button"; 

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  categoryName: string;
  successMessage: any;
  error: any;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
  isOpen,
  onClose,
  onDelete,
  categoryName,
  successMessage,
  error,
}) => {
  const { showToast } = useCustomToast(); 

  useEffect(() => {
    if (successMessage) {
      showToast({
        message: successMessage,
        type: "success",
        duration: 3000, 
      });
    }

    if (error) {
      showToast({
        message: error,
        type: "error",
        duration: 3000, 
      });
    }
  }, [successMessage, error, showToast]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[90%] max-w-md p-6">
        {/* Trash Icon */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-gray-800 rounded-full">
            <FaTrash className="text-red-500 text-3xl" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-2 dark:text-gray-100">Delete</h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6 dark:text-gray-100">
          Are you sure you want to delete {categoryName}?
        </p>

        {/* Buttons */}
        <div className="flex justify-between flex-col items-center dark:text-gray-100">
          <Button
            onClick={onDelete}
            Buttonclass="w-[48%] bg-red-500 text-white px-4 py-3 hover:bg-red-600 my-5 transition-all rounded-lg"
            type="delete"
          >
            Delete
          </Button>
          <Button
            children={<p>Cancel</p>}
            Buttonclass="w-[48%] bg-gray-200 text-gray-800 hover:bg-gray-300 dark:text-gray-100 dark:hover:text-gray-800 rounded-lg"
            type="transparent"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
