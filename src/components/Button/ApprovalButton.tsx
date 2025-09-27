import React, { useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import useCustomToast from "../../hooks/useCustomToast";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { CircularProgress } from "@mui/material";


interface ApprovalButtonProps {
    entity: string;
    purpose: 'profile_approval' | 'profile_edit_approval' | 'product_service_approval' | 'product_service_reapproval'; // Purpose of approval
    id: number;
    // onError?: (error: any) => void;
    onSuccess?: () => void;
    disabled?: boolean;
    className?: string;
    type: string;
    url?: string;
}

const ApprovalButton: React.FC<ApprovalButtonProps> = ({
    entity,
    purpose,
    id,
    type,
    url
}) => {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useCustomToast();
    const { darkMode } = useSelector((state: RootState) => state.theme)
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const navigate = useNavigate();
    console.log(darkMode)
    const handleApproval = async () => {
        setLoading(true);
        try {
            const payload = {
                data: {
                    attributes: {
                        purpose: purpose,
                        approvable_id: id,
                        approvable_type: `App\\Models\\${entity}`,
                    },
                },
            };

            const response = await axiosInstance.post(
                "/approvals",
                payload
            );

            if (response.status === 200) {
                showToast({ message: `${response.data.message}. Redirecting you shortly...`, duration: 3000, type: 'success' });
                setTimeout(() => {
                    // showToast({ message: 'Redirecting...', duration: 2000, type: 'success' });
                    navigate(`${url}`); // Replace '/your-target-route' with your desired path
                }, 3000);
            }

            else if (response.data.message == 'An approval request is already raised and awaiting.') {
                showToast({ message: response.data.message, duration: 3000, type: 'info' });
                return;

            } else if (response.data.message == 'Can request for only self') {
                showToast({ message: 'User not found', duration: 3000, type: 'error' });
                return;
            }
            else {
                throw new Error(response.data.message);
            }

        } catch (error: any) {
            showToast({ message: error.message, duration: 3000, type: 'error' });
            console.error("Error submitting approval:", error);
        } finally {
            setLoading(false);
            closeModal();
        }
    };

    return (
        <div>
            <button
                onClick={openModal}
                className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#6056E6] hover:bg-blue-600 rounded-lg z-[9999]"
                    }`}
                disabled={loading}
            >
                {loading ? "Submitting..." : "Submit for Approval"}
            </button>

            {isModalOpen && (
                <Modal
                    open={isModalOpen}
                    onClose={closeModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                // sx={{
                //     backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                //     color: darkMode ? '#000000' : '#000000',
                // }}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: darkMode ? '#1F2937' : 'rgba(255, 255, 255, 0.8)',
                        borderRadius: "12px",
                        boxShadow: 24,
                        p: 3,
                        color: darkMode ? '#ffffff' : '#000000',
                    }}>
                        <h2 className="text-lg font-semibold mb-4">Confirm Approval</h2>
                        <p>
                            Are you sure you want to submit approval for{" "}
                            <b>{type}</b> ?
                        </p>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded dark:hover:text-white bg-gray-200 hover:bg-gray-400 dark:text-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={loading ? true : false}
                                onClick={handleApproval}
                                className="py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center w-[85px]"
                            >
                                {loading ? (
                                    <CircularProgress className="flex items-center text-white" color="inherit" size={20} thickness={8} />
                                ) : (
                                    <span>Confirm</span>
                                )}
                            </button>
                        </div>
                    </Box>
                </Modal>
            )
            }
        </div >
    );
};

export default ApprovalButton;
