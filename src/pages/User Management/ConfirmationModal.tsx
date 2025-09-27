import React, { ReactElement } from "react";
import Button from "../../components/Button/Button";

type ModalProps = {
    icon: ReactElement
    isOpen: boolean;
    onClose?: () => void;
    title?: string;
    description?: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
};

const ConfirmationModal: React.FC<ModalProps> = ({
    icon,
    isOpen,
    onClose,
    title = "Are you sure?",
    description = "Are you sure you want to proceed?",
    onConfirm,
    confirmText = "Yes",
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[90%] max-w-md p-6">
                {/* Checkmark Icon */}
                <div className="flex justify-center mb-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-gray-800 rounded-full">
                        {icon}
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-center mb-2 dark:text-gray-100">{title}</h2>

                {/* Description */}
                <p className="text-gray-600 text-center mb-6 dark:text-gray-100">{description}</p>

                {/* Buttons */}
                <div className="flex justify-between flex-col items-center dark:text-gray-100">
                    <Button
                        onClick={onConfirm}
                        Buttonclass="w-[48%] bg-[#2854A3] text-white px-4 py-3 hover:bg-[#3976e0] my-5 transition-all rounded-lg"
                        type={confirmText === 'Activate' || confirmText === 'Activating . . .' ? 'success' : 'delete'}
                    >
                        {confirmText}
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

export default ConfirmationModal;