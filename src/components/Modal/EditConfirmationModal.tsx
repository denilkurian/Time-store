import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Button from "../Button/Button"

interface EditConfirmationModalProps {
    icon: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    onConfirm: () => void;
    confirmText: string;
    cancelText: string;
}

const EditConfirmationModal: React.FC<EditConfirmationModalProps> = ({
    icon,
    isOpen,
    onClose,
    title,
    description,
    onConfirm,
    confirmText,
    cancelText,
}) => {
    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{
                style: {
                    padding: '20px',
                    borderRadius: '12px',  // Add border radius to the modal
                    width: '400px',      // Minimize the width of the modal
                }
            }}>
            <DialogTitle style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: '10px',
            }}>
                {/* Edit icon centered with background shadow and rounded */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        backgroundColor: 'rgb(220 252 231)',
                        width: '60px',
                        height: '60px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        marginBottom: '15px',
                        fontSize: '30px',
                        color: '#fff',
                    }}
                >
                    {icon}
                </div>
                {/* Title below the icon */}
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{title}</div>
            </DialogTitle>
            <DialogContent style={{ textAlign: 'center', padding: '10px' }}>
                {/* Description below the title */}
                <p style={{ fontSize: '14px', color: '#555' }}>{description}</p>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center', padding: '10px' }}>
                {/* Buttons centered below the description */}
                <Button onClick={onClose}  type="normal" Buttonclass="mr-480">
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    // color="primary"
                    type='primary'
                    Buttonclass="text-white px-5 py-2 font-bold"
                >
                    {confirmText}
                </Button>

            </DialogActions>
        </Dialog>
    );
};

export default EditConfirmationModal;
