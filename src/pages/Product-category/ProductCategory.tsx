import React, { useEffect, useState } from 'react';
import { Box, Button as MUIButton, Typography } from '@mui/material';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import TableComponent from '../../components/Table/TableComponent';
import axiosInstance from '../../utils/axiosConfig';
import AddCategoryModal from '../Product-category/AddCategoryModal';
import EditCategoryModal from '../Product-category/EditcategoryModal';
import DeleteConfirmationModal from '../Product-category/DeleteConfirmationModal';
import useCustomToast from '../../hooks/useCustomToast';


const ProductCategory: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useCustomToast();


    const [error, setError] = React.useState<string>("");
    const [successMessage, setSuccessMessage] = React.useState<string>("");

    // Fetch product categories from the API
    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get('/product-categories');
            const fetchedData = response.data.data.map((item: any, index: number) => ({
                id: item.id,
                no: index + 1,
                name: item.attributes.name,
                pname: item.attributes.parent_id
                    ? response.data.data.find((parent: any) => parent.id === item.attributes.parent_id)?.attributes
                        .name || 'None'
                    : 'None',
                status: item.attributes.status.charAt(0).toUpperCase() + item.attributes.status.slice(1),
                actions: '',
            }));
            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching product categories:', error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);




    const handleAddCategory = (newCategory: { title: string; parentName: string; status: string }) => {
        const newData = [
            ...data,
            {
                id: Math.random().toString(36).substr(2, 9), // Temporary unique ID
                no: data.length + 1,
                name: newCategory.title,
                pname: newCategory.parentName || 'None',
                status: newCategory.status,
                actions: '',
            },
        ];
        setData(newData);
    };


    // Edit category
    const handleEdit = (id: number) => {
        const category = data.find((item) => item.id === id);
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };



    const handleUpdateCategory = async (updatedCategory: { title: string; parentName: string; status: string }) => {
        try {
            setError("");
            setSuccessMessage("");
            const updatedata = {
                data: {
                    attributes: {
                        name: updatedCategory.title, // Map title to name
                        parent_id: updatedCategory.parentName || null, // Pass parent ID or null if none
                        status: updatedCategory.status, // Pass status
                    },
                },
            };

            const response = await axiosInstance.patch(
                `/product-categories/${selectedCategory?.no}`, // Use `selectedCategory.no` for the category ID
                updatedata
            );

            if (response.status === 200) {
                showToast({
                    message: 'Product Category updated successfully!',
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
            console.error("Error updating category:", error?.response?.data || error.message);

            // Dynamically set error message
            const backendErrorMessage = error?.response?.data?.message || error?.message || 'An unknown error occurred.';
            showToast({
                message: backendErrorMessage,
                type: 'error',
                duration: 3000,
            });
        }

        finally {
            fetchCategories();

        }
    };



    // Delete Category
    const handleDelete = (id: number) => {
        const category = data.find((item) => item.id === id);
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteCategory = async () => {
        try {
            const response = await axiosInstance.delete(`product-categories/${selectedCategory.id}`)
            if (response.status === 200) {
                showToast({
                    message: 'Service Category deleted successfully!',
                    type: 'success',
                    duration: 3000,
                }); fetchCategories();
            }
            else {
                showToast({
                    message: response?.data?.message || 'Failed to delete service category.',
                    type: 'error',
                    duration: 3000,
                });
            }
        }

        catch (error: any) {
            const backendErrorMessage = error?.response?.data?.message || error?.message || 'An unknown error occurred.';
            showToast({
                message: backendErrorMessage,
                type: 'error',
                duration: 3000,
            });

        }
        finally {
            fetchCategories();
            setTimeout(() => {
                setIsDeleteModalOpen(false);
                setError('');
                setSuccessMessage('');
            }, 3000);
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
                            onClick={() => handleEdit(row.original.id)}
                            startIcon={<FaEdit className="text-[#573bd6]" />}
                            sx={{ minWidth: 'auto', padding: 0 }}
                        ></MUIButton>
                        <MUIButton
                            onClick={() => handleDelete(row.original.id)}
                            startIcon={<FaTrashAlt className="text-red-500" />}
                            sx={{ minWidth: 'auto', padding: 0 }}
                        ></MUIButton>
                    </Box>
                ),
            },
        ],
        [data]
    );

    return (
        <>
            <div className="App  dark:bg-gray-900 dark:text-white text-black px-3 py-4 h-full">

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Product Categories
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
                    <TableComponent columns={columns}
                        data={data}
                        isPagination={true}
                        isLoading={isLoading}

                    />


                <AddCategoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddCategory}
                />
                <EditCategoryModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdateCategory}
                    category={selectedCategory}
                    successMessage={successMessage}
                    error={error}
                />
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={handleDeleteCategory}
                    categoryName={selectedCategory?.name || ''}
                    successMessage={successMessage}
                    error={error}
                />
            </div>
        </>
    );
};

export default ProductCategory;
