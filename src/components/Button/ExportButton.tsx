import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import Button from './Button';
import { CircularProgress } from '@mui/material';
import { AiOutlineDownload } from 'react-icons/ai';

type Props = {
    fileName: 'user_list' | 'product_list' | 'approval_list' | 'service_list' | 'enquiry_list'
    method: 'get' | 'post'
    api: string;
    onExport: (response: any) => void;
    isDisabled?: boolean;
};

const ExportButton: React.FC<Props> = ({ api, onExport, isDisabled, method, fileName }) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            // Make the GET/POST request
            const response =
                method === 'post'
                    ? await axiosInstance.post(api, '', {
                        responseType: 'blob',
                        headers: {
                            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        },
                    })
                    : await axiosInstance.get(api, {
                        responseType: 'blob',
                        headers: {
                            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        },
                    });

            // Extract filename from the content-disposition header
            const contentDisposition = response.headers['content-disposition'];
            const filenameMatch = contentDisposition?.match(/filename="?(.+?)"?(;|$)/);
            const filename = filenameMatch ? decodeURIComponent(filenameMatch[1]) : `${fileName}.xlsx`;

            // Create a Blob from the response data
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            // Create an object URL for the Blob
            const url = window.URL.createObjectURL(blob);

            // Trigger download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); // Set the filename
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            // Notify success
            onExport(response);
        } catch (error) {
            console.error('Error exporting data:', error);
            onExport({ error: 'Failed to export data' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button
                Buttonclass={`${loading ? 'justify-center' : 'justify-center'}`}
                type='primary'
                icon={loading ? <span className="loader" /> : <AiOutlineDownload className="ml-3 w-7 h-7 -mr-[10px] text-3xl font-bold" />}
                onClick={handleDownload}
                disabled={loading || isDisabled}
            >
                {loading ? <CircularProgress color='inherit' size={20} className='-mr-[9px]' thickness={7} /> : 'Export'}
            </Button>
        </div>
    );
};

export default ExportButton;
