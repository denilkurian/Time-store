import React, { useEffect, useState } from 'react';
import { Box, Button as MUIButton, Typography } from '@mui/material';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import TableComponent from '../../components/Table/TableComponent';
import axiosInstance from '../../utils/axiosConfig';
import AddCategory from '../../pages/Service-category/AddCategory';
import Editcategory from '../../pages/Service-category/Editcategory';
import DeleteConfirm from '../../pages/Service-category/DeleteConfirm';
import useCustomToast from '../../hooks/useCustomToast';
// import { useNavigate } from 'react-router-dom';

const ServiceCategory: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedServiceCategory, setSelectedServiceCategory] = useState<any>(null);
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useCustomToast();

    // const navigate = useNavigate();

    const [error, setError] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');

    const fetchServiceCategories = async () => {
        try {
            setIsLoading(false);
            const response = await axiosInstance.get('/service-categories');
            const fetchedData = response.data.data.map((item: any, index: number) => ({
                id: item.id,
                no: index + 1,
                name: item.attributes.name,
                pname: item.attributes.parent_id
                    ? response.data.data.find((parent: any) => parent.id === item.attributes.parent_id)?.attributes.name || 'None'
                    : 'None',
                status: item.attributes.status.charAt(0).toUpperCase() + item.attributes.status.slice(1),
                actions: '',
            }));
            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching service categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceCategories();
    }, []);

    const handleAddServiceCategory = (newCategory: { title: string; parentName: string; status: string }) => {
        const newData = [
            ...data,
            {
                id: Math.random().toString(36).substr(2, 9),
                no: data.length + 1,
                name: newCategory.title,
                pname: newCategory.parentName || 'None',
                status: newCategory.status,
                actions: '',
            },
        ];
        setData(newData);
    };

    const handleEditServiceCategory = (id: number) => {
        const serviceCategory = data.find((item) => item.id === id) || null;
        setSelectedServiceCategory(serviceCategory);
        setIsEditModalOpen(true);
    };

    const handleUpdateServiceCategory = async (updatedCategory: { title: string; parentName: string; status: string }) => {
        try {
            setError('');
            setSuccessMessage('');
            const updatedata = {
                data: {
                    attributes: {
                        name: updatedCategory.title,
                        parent_id: updatedCategory.parentName || null,
                        status: updatedCategory.status,
                    },
                },
            };

            const response = await axiosInstance.patch(
                `/service-categories/${selectedServiceCategory?.id}`,
                updatedata
            );

            if (response.status === 200) {
                showToast({
                    message: 'Service Category updated successfully!',
                    type: 'success',
                    duration: 3000,
                });
            } else {
                showToast({
                    message: response?.data?.message || 'Service category already exists.',
                    type: 'error',
                    duration: 3000,
                });
            }
        } catch (error: any) {
            const backendErrorMessage = error?.response?.data?.message || error?.message || 'An unknown error occurred.';
            showToast({
                message: backendErrorMessage,
                type: 'error',
                duration: 3000,
            });
        } finally {
            fetchServiceCategories();
        }
    };

    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'no',
                header: 'Sl. No',
            },
            {
                accessorKey: 'name',
                header: 'Category Name',
            },
            {
                accessorKey: 'pname',
                header: 'Parent Name',
            },
            {
                accessorKey: 'status',
                header: 'Status',
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                Cell: ({ row }: any) => (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <MUIButton
                            onClick={() => handleEditServiceCategory(row.original.id)}
                            startIcon={<FaEdit className="text-[#573bd6]" />}
                            sx={{ minWidth: 'auto', padding: 0 }}
                        />
                        <MUIButton
                            onClick={() => {
                                setSelectedServiceCategory(row.original); // Set the selected service category
                                setIsDeleteModalOpen(true); // Open the delete modal
                            }}
                            startIcon={<FaTrashAlt className="text-red-500" />}
                            sx={{ minWidth: 'auto', padding: 0 }}
                        />
                    </Box>
                ),
            },
        ],
        [data]
    );

    const confirmDeleteServiceCategory = async () => {
        try {
            setError('');
            setSuccessMessage('');

            if (!selectedServiceCategory || !selectedServiceCategory.id) {
                showToast({
                    message: 'No service category selected for deletion.',
                    type: 'error',
                    duration: 3000,
                }); return;
            }

            const response = await axiosInstance.delete(`/service-categories/${selectedServiceCategory.id}`);

            if (response.status === 200 || response.status === 204) {
                showToast({
                    message: 'Service Category deleted successfully!',
                    type: 'success',
                    duration: 3000,
                }); fetchServiceCategories();
                setIsDeleteModalOpen(false);
            } else {
                showToast({
                    message: response?.data?.message || 'Failed to delete service category.',
                    type: 'error',
                    duration: 3000,
                });
            }
        } catch (error: any) {
            const backendErrorMessage = error?.response?.data?.message || error?.message || 'An unknown error occurred.';
            showToast({
                message: backendErrorMessage,
                type: 'error',
                duration: 3000,
            });
        }
    };

    return (
        <>
            <div className="App dark:bg-gray-900 dark:text-white text-black px-3 py-4 h-full">

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Service Categories
                    </Typography>
                    <MUIButton
                        onClick={() => setIsModalOpen(true)}
                        variant="contained"
                        color="primary"
                        startIcon={<FaPlus />}
                    >
                        Add New
                    </MUIButton>
                </Box>
                    <TableComponent
                        columns={columns}
                        data={data}
                        isPagination={true} 
                        count={data.length} 
                        isLoading={isLoading}

                    />

                <AddCategory
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddServiceCategory}
                />
                <Editcategory
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdateServiceCategory}
                    category={selectedServiceCategory}
                    successMessage={successMessage}
                    error={error}
                />

                <DeleteConfirm
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={confirmDeleteServiceCategory}
                    categoryName={selectedServiceCategory?.name || ''}
                    successMessage={successMessage}
                    error={error}
                />
            </div>
        </>
    );
};

export default ServiceCategory;
