import React, { useEffect, useState } from 'react';
import TableComponent from '../../components/Table/TableComponent';
import { FaTrashAlt, FaBan } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosConfig';
import { ProductApiResponse, ProductAttributes } from './ProductModel';
import { Box } from '@mui/material';
import { MRT_Row } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../User Management/ConfirmationModal';
import useCustomToast from '../../hooks/useCustomToast';
import { RootState } from '../../redux/store/store';
import { useSelector } from 'react-redux';
import AddProductModal from './AddProductModal';
import EditConfirmationModal from '../../components/Modal/EditConfirmationModal';

import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';

import ViewApproval from '../Admin_approval/view_approval';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ExportButton from '../../components/Button/ExportButton';
import { AiFillDelete, AiOutlineEdit, AiOutlineEye, AiOutlineFileAdd } from 'react-icons/ai';
import { MdOutlineBlock } from 'react-icons/md';
import Heading from '../../components/Heading/Heading';
import dayjs from 'dayjs';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductAttributes[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const { showToast } = useCustomToast();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const userType = useSelector((state: RootState) => state.auth.userType);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);

  const [productName, setProductName] = useState('')
  const [status, setStatus] = useState('')

  // State for edit modal
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);

  // Open edit confirmation modal
  const openEditConfirmationModal = (id: number) => {
    setEditProductId(id);
    setEditModalOpen(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditProductId(null);
  };

  const handleAddProduct = (product?: { title: string; id: number }) => {
    const newProduct = {
      id: product?.id as number,
      name: product?.title,
      status: 'active',
      actions: '',
      no: products.length + 1, // Incremented index
      excerpt: '',
      mrp: 0, // Default MRP
    };
    setProducts([...products, newProduct as ProductAttributes]);
  };

  const handleCloseAddProductModal = () => {
    setIsAddProductModalOpen(false);
  };

  const handleOpenAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const fetchProductDetails = async (page = 1) => {
    try {
      let response;
      setLoading(true);
      if (userType === 'admin') {
        if (status) {
          response = await axiosInstance.get<ProductApiResponse>(`products?status=${status}&page=${page}`);
          // setLoading(false);
        }
        else {
          response = await axiosInstance.get<ProductApiResponse>(`products?page=${page}`);
          // setLoading(false);
        }

      } else if (userType === 'vendor') {
        if (status || productName) {
          response = await axiosInstance.get<ProductApiResponse>(`/users/${userId}/products?name=${productName}&status=${status}`);
          console.log(productName)
          // setLoading(false);
        }
        else {
          response = await axiosInstance.get<ProductApiResponse>(`users/${userId}/products?page=${page}`);
        }
        // setLoading(false);
      } else {
        throw new Error('Invalid user type');
      }

      if (!response || !response.data || !response.data.data) {
        throw new Error('Unexpected API response structure');
      }

      const fetchedProducts = response.data.data.map((x) => x.attributes);

      const mappedData: ProductAttributes[] = fetchedProducts.map((product, index) => ({
        id: product.id, // Ensure `id` exists in `fetchedProducts`
        product_id: product.id,
        no: index + 1 + (page - 1) * 10,
        name: product.name,
        mrp: product.mrp,
        status: product.status,
        minimum_order: product.minimum_order,
        category_id: product.category_id,
        sub_category_id: product.sub_category_id,
        created_at: product.created_at,
        updated_at: product.updated_at || new Date(), // Provide default if missing
        user_id: product.user_id || 0, // Default value if user_id is not present
        display_picture: product.display_picture || '', // Default if missing
        actions: '',
        excerpt: product.excerpt,
        description: product.description,
      }));

      setProducts(mappedData);
      setData(mappedData);
      setCount(response.data.meta.last_page);
      console.log("prdcts", response.data);

    } catch (error) {
      console.error('Error fetching product details:', error);
    }

    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [status, productName]);


  const handleEdit = async (id: number) => {
    try {
      // Fetch the product details
      const response = await axiosInstance.get(`/products/${id}`);

      if (response.status === 200) {
        const productData = response.data.data.attributes;

        const status = productData.status;
        console.log('Product status:', status);

        if (status === 'draft' || status === 'revision') {
          console.log('Product status is draft. Navigating to edit page...');
          navigate(`/edit-product/${id}`, { state: { productId: id } });
        }
        else if (status === 'pending_approval' || status === 'pending_change_approval' || status === 'inactive') {
          showToast({ message: `You can't edit product in ${status} state.`, duration: 3000, type: 'error' });
        }
        else if (status === 'active') {
          console.log('Product status is active. Updating to revision status...');
          const updateResponse = await axiosInstance.post(`/products/${id}/status/revision`);

          if (updateResponse.status === 200) {
            const updateData = updateResponse.data;

            console.log('Product updated to revision status successfully:', updateData.message);
            navigate(`/edit-product/${id}`, { state: { productId: id } });
          } else {
            console.error('Failed to update product status:', updateResponse.statusText);
          }
        } else {
          console.log(`Product status is ${status}. No action taken.`);
        }
      } else {
        console.error('Failed to fetch product details:', response.statusText);
      }
    } catch (error) {
      console.error('Error handling product edit:', error);
    }
  };

  // Confirm edit
  const handleConfirmEdit = async () => {
    if (editProductId !== null) {
      try {
        // Fetch the product details
        const response = await axiosInstance.get(`/products/${editProductId}`);
        if (response.status === 200) {
          const productData = response.data.data.attributes;
          const status = productData.status;

          if (status === 'draft' || status === 'revision') {
            console.log('Product status is draft. Navigating to edit page...');
            navigate(`/edit-product/${editProductId}`, { state: { productId: editProductId, status: status } });
          } else if (status === 'pending_approval' || status === 'pending_change_approval' || status === 'inactive') {
            showToast({ message: `You can't edit product in ${status} state.`, duration: 3000, type: 'error' });
          } else if (status === 'active') {
            console.log('Product status is active. Updating to revision status...');
            const updateResponse = await axiosInstance.post(`/products/${editProductId}/status/revision`);

            if (updateResponse.status === 200) {
              const updateData = updateResponse.data;
              console.log('Product updated to revision status successfully:', updateData.message);
              showToast({ message: 'Product updated to revision status successfully.', duration: 3000, type: 'success' });
              console.log('getting status', status)
              navigate(`/edit-product/${editProductId}`, { state: { productId: editProductId, status: 'revision' } });

            } else {
              console.error('Failed to update product status:', updateResponse.statusText);
            }
          } else {
            console.log(`Product status is ${status}. No action taken.`);
          }
        } else {
          console.error('Failed to fetch product details:', response.statusText);
        }
      } catch (error) {
        console.error('Error handling product edit:', error);
      } finally {
        handleCloseEditModal();
      }
    }
  };


  // Block Product
  const handleOpenBlockModal = (id: number) => {
    setSelectedProductId(id);
    setIsBlockModalOpen(true);
  };

  const handleCloseBlockModal = () => {
    setIsBlockModalOpen(false);
  };

  const handleBlock = async () => {
    if (!selectedProductId) return;
    try {
      await axiosInstance.post(`/products/${selectedProductId}/status/deactivate`);
      showToast({ message: 'Product blocked successfully', duration: 3000, type: 'success' });
      fetchProductDetails();
    } catch (error) {
      showToast({ message: 'Failed to block product', duration: 3000, type: 'error' });
    }
    setIsBlockModalOpen(false);
  };

  const handleViewProduct = (product: any) => {
    setSelectedProductDetails({ ...product, type: product.type || 'Product' });
    setIsViewModalOpen(true);
  };

  // Delete Product
  const handleOpenDeleteModal = (id: number) => {
    setSelectedProductId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProductId) return;

    try {
      await axiosInstance.delete(`/products/${selectedProductId}`);
      showToast({ message: 'Product deleted successfully', duration: 3000, type: 'success' });
      // Refresh product data after deletion
      fetchProductDetails();
    } catch (error) {
      showToast({ message: 'Failed to delete product', duration: 3000, type: 'error' });
    }
    setIsDeleteModalOpen(false);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };
  // Pagination
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number | undefined>(1);

  const handleChangePage = async (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    await fetchProductDetails(newPage); // Trigger data for the new page
    console.log(page)
  };
  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'no',
        header: 'Sl. No', size: 100,
      },
      {
        accessorKey: 'name',
        header: 'Product Name', size: 200,
        Cell: ({ row }: { row: MRT_Row<any> }) => {
          const product_name = row.original.name;
          return (
            <span
              style={{
                fontSize: '1rem',
                fontWeight: 350,
                width: '15rem', // Limit the width
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                display: 'inline-block',
                transition: 'width 0.3s ease', // Smooth transition when expanding
              }}
              title={product_name}
              onMouseEnter={(e) => {
                e.currentTarget.style.width = 'auto'; // Expand the width on hover
                e.currentTarget.style.cursor = 'pointer';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.width = '8rem'; // Revert to original width when not hovered
              }}
            >
              {product_name}
            </span>
          );
        }
      },
      {
        accessorKey: 'mrp',
        header: 'MRP', size: 100,
        Cell: ({ row }: { row: MRT_Row<any> }) => {
          const mrp = row.original.mrp; // Access the MRP value
          return <span>{mrp ? `₹ ${mrp}` : 'N/A'}</span>; // Add the rupee symbol
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ row }: { row: MRT_Row<any> }) => {
          const status = row.original.status;
          let statusColor = '';
          const formattedData = status.replace(/_/g, ' ')
            .replace(/\b\w/g, (char: string) => char.toUpperCase());
          if (status === 'active') statusColor = 'bg-[#B2FEC2] text-[#527A4D]';
          else if (status === 'inactive') statusColor = 'bg-[#FEC2C2] text-[#7A4D4D]';
          else if (status === 'pending_change_approval' || status === 'pending_approval') statusColor = 'bg-[#FCF38F] text-[#527A4D]';
          else if (status === 'draft') statusColor = 'bg-[white] border-2  text-[#527A4D]';
          else if (status === 'revision') statusColor = 'bg-[white] border-2 border-black-400  text-[#527A4D]';
          return <div className={`px-4 py-2 rounded-full mr-6 ${statusColor}`}>
            <p>{formattedData}</p>
          </div>;
        },
        size: 100,
      },

      {
        accessorKey: 'date',
        header: 'Date & Time',
        Cell: ({ row }: { row: MRT_Row<any> }) => {
          const date = new Date(row.original.created_at);
          const formattedDate = dayjs(date).format('DD-MM-YYYY h:mm A');
          return <span>{formattedDate}</span>;
        },
      },

      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 100,
        Cell: ({ row }: { row: MRT_Row<any> }) => (
          <Box sx={{ display: 'flex', gap: '22px' }}>

            {/* View Product */}
            <button
              onClick={() => handleViewProduct(row.original)}
              className="text-blue-500 hover:text-blue-700"
              title="View"
            >
              <AiOutlineEye className="w-5 h-5" />
            </button>

            {userType === 'vendor' &&
              <button
                onClick={() => openEditConfirmationModal(row.original.product_id)}
                className="text-green-500 hover:text-green-700"
                title="Edit"
              >
                <AiOutlineEdit className="w-5 h-5" />
              </button>}


            {/* Delete Product */}
            <button
              onClick={() => handleOpenDeleteModal(row.original.product_id)}
              className="text-red-500 hover:text-red-700"
              title="Delete"
            >
              <AiFillDelete className="w-5 h-5" />
            </button>

            {/* Block Product */}
            {userType === 'admin' && (row.original.status !== 'inactive' && row.original.status !== 'draft' && row.original.status !== 'revision'
              && row.original.status !== 'pending_change_approval' && row.original.status !== 'pending_approval'
            ) && (
                <button
                  onClick={() => handleOpenBlockModal(row.original.product_id)}
                  className="text-red-500 hover:text-red-700"
                  title="Block"
                >
                  <MdOutlineBlock className="w-5 h-5" />
                </button>)}

          </Box>
        ),
      },
    ],
    [handleEdit, handleViewProduct, handleOpenBlockModal, handleOpenDeleteModal]
  );
  const handleExportResponse = (response: any) => {
    if (response?.data) {
      console.log('Export successful!', response);
    } else if (response?.error) {
      console.error('Error:', response.error);
    }
  };


  return (

    <div className="bg-[#F6EFFF] dark:bg-gray-900 dark:text-white text-black px-3 py-4 h-full">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Heading className="mt-5 pt-5" title="Product Management" />
      </Box>


      <div className="my-9 w-[500px] flex gap-6 items-center">
        {userType === 'vendor' && (
          <form className="flex w-[200px]">
            <div className="flex flex-col">
              <InputField
                onChange={(e) => setProductName(e.target.value)}
                value={productName}
                placeholder="Enter Product Name"
                name="phone"
                className="bg-[#D7CFCF80] dark:bg-gray-800 rounded-lg h-[55px] flex items-center"
              />
            </div>
          </form>
        )}

        <FormControl fullWidth sx={{ width: 150, height: '40px' }}>
          <InputLabel className="dark:text-white" shrink>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
            className="dark:bg-gray-800 dark:text-white h-[50px]"
            displayEmpty
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">InActive</MenuItem>
            <MenuItem value="pending_approval">Pending Approval</MenuItem>
            <MenuItem value="pending_change_approval">Pending Change Approval</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="revision">Revision</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className='w-full flex text-right items-end justify-end my-5 gap-4'>
        {userType === 'vendor' &&
          <Button onClick={handleOpenAddProductModal} Buttonclass="w-[140px] flex item-center justify-around font-normal items-end" type="primary">
            Add <AiOutlineFileAdd className="ml-3 w-7 h-7 -mr-[10px] text-3xl font-bold" />
          </Button>}

        <ExportButton
          fileName='product_list'
          method='post'
          api={
            userType === 'vendor'
              ? `/users/${userId}/products/export?${status ? `status=${encodeURIComponent(status)}&` : ''}${productName ? `name=${encodeURIComponent(productName)}` : ''}`
              : `/products/export?${status ? `status=${encodeURIComponent(status)}&` : ''}${productName ? `name=${encodeURIComponent(productName)}` : ''}`
          }

          onExport={handleExportResponse} />
      </div>


      <TableComponent
        isPagination={true}
        columns={columns}
        data={data}
        isLoading={loading}
        enableRowSelection={false}
        count={count}
        onChangePage={handleChangePage}
      />


      {/* Delete Modal */}
      <ConfirmationModal
        icon={<FaTrashAlt className="text-2xl text-[#F40A0A]" />}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Delete Product"
        description="Are you sure you want to Delete this product?"
        onConfirm={handleDeleteProduct}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Block Modal */}
      <ConfirmationModal
        icon={<FaBan className="text-2xl text-[#F40A0A]" />}
        isOpen={isBlockModalOpen}
        onClose={handleCloseBlockModal}
        title="Block Product"
        description="Are you sure you want to block this product?"
        onConfirm={handleBlock}
        confirmText="Block"
        cancelText="Cancel"
      />
      {/* Confirmation Modal for Edit */}
      <EditConfirmationModal
        icon={<AiOutlineEdit className="text-2xl text-green-500" />}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Update Product"
        description="Are you sure want to Update this product?"
        onConfirm={handleConfirmEdit}
        confirmText="Yes"
        cancelText="No"
      />

      <ViewApproval isModalOpen={isViewModalOpen} viewData={selectedProductDetails} closeModal={handleCloseViewModal} />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={handleCloseAddProductModal}
        onSubmit={() => handleAddProduct()}
      />


      {/* <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={handleCloseAddProductModal}
        onAddProduct={handleAddProduct}
      /> */}
    </div>


  );
};

export default ProductList;
