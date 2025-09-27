import React, { useEffect, useState } from 'react';
import TableComponent from '../../components/Table/TableComponent';
import { FaTrashAlt, FaBan } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosConfig';
import { Box } from '@mui/material';
import { MRT_Row } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../User Management/ConfirmationModal';
import useCustomToast from '../../hooks/useCustomToast';
import { ServiceApiResponse } from './ServiceModal';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import ExportButton from '../../components/Button/ExportButton';
import { RootState } from '../../redux/store/store';
import { useSelector } from 'react-redux';
import AddService from './Addservice';
import Heading from '../../components/Heading/Heading';
import { AiFillDelete, AiOutlineEdit, AiOutlineEye, AiOutlineFileAdd } from 'react-icons/ai';
import { MdOutlineBlock } from 'react-icons/md';
import ViewApproval from '../Admin_approval/view_approval';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import EditConfirmationModal from '../../components/Modal/EditConfirmationModal';
import dayjs from 'dayjs';



const Servicelist: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { showToast } = useCustomToast();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const userType = useSelector((state: RootState) => state.auth.userType);

  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState<boolean>(false);
  const handleOpenAddServiceModal = () => setIsAddServiceModalOpen(true);

  const [serviceName, setServiceName] = useState('')
  const [status, setStatus] = useState('')



  // State for edit modal
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editServiceId, setEditServiceId] = useState<number | null>(null);

  // Open edit confirmation modal
  const openEditConfirmationModal = (id: number) => {
    setEditServiceId(id);
    setEditModalOpen(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditServiceId(null);
  };

  // Add service
  const handleAddService = (service: { title: string; id: number }) => {
    const newService = {
      id: service.id,
      name: service.title,
      status: 'active',
      actions: '',
      no: services.length + 1, // Incremented index
      description: '',
    };
    setServices([...services, newService]);

    navigate('/edit-service', { state: { serviceId: service.id } });
  };


  // Fetch all setServices
  const fetchserviceDetails = async (page = 1) => {
    try {
      let response;


      setLoading(true);
      if (userType === 'admin') {
        if (status) {
          response = await axiosInstance.get<ServiceApiResponse>(`services?status=${status}&page=${page}`);
        }
        else {
          response = await axiosInstance.get<ServiceApiResponse>(`services?page=${page}`);
        }
      } else if (userType === 'vendor') {
        if (status || serviceName) {
          response = await axiosInstance.get<ServiceApiResponse>(`/users/${userId}/services?name=${serviceName}&status=${status}`);
          console.log(serviceName)
          // setLoading(false);
        }
        else {
          response = await axiosInstance.get<ServiceApiResponse>(`users/${userId}/services?page=${page}`);
        }
        // setLoading(false);
      } else {
        throw new Error('Invalid user type');
      }


      if (!response || !response.data || !response.data.data) {
        throw new Error('Unexpected API response structure');
      }
      const fetchedservices = response.data.data.map((x) => x.attributes);


      const mappedData = fetchedservices.map((service, index) => ({
        service_id: service.id,
        serviceId: service.id,  // Ensure to store the serviceId here
        no: index + 1 + (page - 1) * 10, // Adjust index for correct pagination numbering
        userId: service.user_id,
        serviceImage: service.service_image, // Display picture mapped as serviceImage
        name: service.name,
        description: service.description ?? service.excerpt, // Use description or fallback to excerpt
        categoryId: service.category_id,
        subCategoryId: service.sub_category_id,
        cost: service.mrp, // Map MRP to cost
        duration: service.minimum_order, // Map minimum_order to duration
        status: service.status,
        createdAt: service.created_at,

        // The below data_variable namings is mandatory to get the fetched data from approvalSlice used for View product/Services as a component
        product_id: service.id,
        category_id: service.category_id,
        minimum_order: service.minimum_order,
        sub_category_id: service.sub_category_id,
        excerpt: service.excerpt,
        mrp: service.mrp,
        service_unit: service.service_unit,
      }));

      setServices(mappedData);
      setData(mappedData);
      setCount(response.data.meta.last_page);
    } catch (error) {
      console.error('Error fetching service details:', error);
    }
    finally {
      setLoading(false)
    }
  };



  useEffect(() => {
    fetchserviceDetails();
  }, [serviceName, status]);

  // Edit Service

  const handleEdit = async () => {
    try {
      // Fetch the service details
      const response = await axiosInstance.get(`/services/${editServiceId}`);

      if (response.status === 200) {
        const serviceData = response.data.data.attributes;

        const status = serviceData.status;
        console.log('service status:', status);

        if (status === 'draft' || status === 'revision') {
          console.log('service status is draft. Navigating to edit page...');
          navigate('/edit-service/:id', { state: { serviceId: editServiceId, status: status } });

        }

        else if (status === 'pending_approval' || status === 'pending_change_approval' || status === 'inactive') {
          showToast({ message: `You can't edit services in ${status} state.`, duration: 3000, type: 'error' });
        }

        else if (status === 'active') {
          console.log('service status is active. Updating to revision status...');
          const updateResponse = await axiosInstance.post(`/services/${editServiceId}/status/revision`);

          if (updateResponse.status === 200) {
            const updateData = updateResponse.data;

            console.log('service updated to revision status successfully:', updateData.message);
            navigate('/edit-service/:id', { state: { serviceId: editServiceId, status: 'revision' } });
          } else {
            console.error('Failed to update service status:', updateResponse.statusText);
          }
        } else {
          console.log(`service status is ${status}. No action taken.`);
        }
      } else {
        console.error('Failed to fetch service details:', response.statusText);
      }
    } catch (error) {
      console.error('Error handling service edit:', error);
    }
    finally {
      setEditModalOpen(false)
    }
  };



  // Block Service
  const handleOpenBlockModal = (id: number) => {
    setSelectedServiceId(id);
    setIsBlockModalOpen(true);
  };

  const handleCloseBlockModal = () => {
    setIsBlockModalOpen(false);
  };

  const handleBlock = async () => {
    if (!selectedServiceId) return;
    try {
      await axiosInstance.post(`/services/${selectedServiceId}/status/deactivate`);
      showToast({ message: 'Service blocked successfully', duration: 3000, type: 'success' });
      fetchserviceDetails();
    } catch (error) {
      showToast({ message: 'Failed to block service', duration: 3000, type: 'error' });
    }
    setIsBlockModalOpen(false);
  };

  const handleViewService = (service: any) => {
    setSelectedServiceDetails({ ...service, type: service.type || 'Service' });
    setIsViewModalOpen(true);
  };

  const handleCloseAddServiceModal = () => {
    setIsAddServiceModalOpen(false);
  };

  // Delete Service
  const handleOpenDeleteModal = (id: number) => {
    setSelectedServiceId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteService = async () => {
    if (!selectedServiceId) return;

    try {
      await axiosInstance.delete(`/services/${selectedServiceId}`);
      showToast({ message: 'Service deleted successfully', duration: 3000, type: 'success' });
      fetchserviceDetails();
    } catch (error) {
      showToast({ message: 'Failed to delete service', duration: 3000, type: 'error' });
    }
    setIsDeleteModalOpen(false);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number | undefined>(2);

  const handleChangePage = async (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    await fetchserviceDetails(newPage);
    console.log(page)
  };

  const handleExportResponse = (response: any) => {
    if (response?.data) {
      console.log('Export successful!', response);
    } else if (response?.error) {
      console.error('Error:', response.error);
    }
  };


  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'no',
        header: 'Sl. No', size: 100,
      },

      {
        accessorKey: 'name',
        header: 'Service Name', size: 200,
        Cell: ({ row }: { row: MRT_Row<any> }) => {
          const service_name = row.original.name;
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
              title={service_name}
              onMouseEnter={(e) => {
                e.currentTarget.style.width = 'auto'; // Expand the width on hover
                e.currentTarget.style.cursor = 'pointer';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.width = '8rem'; // Revert to original width when not hovered
              }}
            >
              {service_name}
            </span>
          );
        }
      },

      {
        accessorKey: 'mrp',
        header: 'MRP', size: 100,
        Cell: ({ row }: { row: any }) => {
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
          return <div className={`px-4 py-2 rounded-full mr-8 ${statusColor}`}>{formattedData}</div>;
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Date & Time', size: 100,
        Cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
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
              onClick={() => handleViewService(row.original)}
              className="text-blue-500 hover:text-blue-700"
              title="View"
            >
              <AiOutlineEye className="w-5 h-5" />
            </button>

            {/* Edit Product */}
            {userType === 'vendor' &&
              <button
                onClick={() => openEditConfirmationModal(row.original.service_id)}
                className="text-green-500 hover:text-green-700"
                title="Edit"
              >
                <AiOutlineEdit className="w-5 h-5" />
              </button>}


            {/* Delete Product */}
            <button
              onClick={() => handleOpenDeleteModal(row.original.service_id)}
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
                  onClick={() => handleOpenBlockModal(row.original.service_id)}
                  className="text-red-500 hover:text-red-700"
                  title="Block"
                >
                  <MdOutlineBlock className="w-5 h-5" />
                </button>)}
          </Box>
        ),
      },],
    [handleEdit, handleOpenBlockModal, handleViewService]
  );

  return (
    <div className="bg-[#F6EFFF] dark:bg-gray-900 dark:text-gray-200 text-black px-3 py-4 h-full">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Heading className="mt-5 pt-5" title="Service Management" />
      </Box>

      <div className="my-9 w-[500px] flex gap-6 items-center">
        {userType === 'vendor' &&
          <form className="flex w-[200px]">
            <div className="flex flex-col">
              {/* <label htmlFor="phone" className="text-sm">
              Product
            </label> */}
              <InputField
                onChange={(e) => setServiceName(e.target.value)}
                value={serviceName}
                placeholder='Enter Service Name'
                name='phone'
                className='bg-[#D7CFCF80] dark:bg-gray-800 rounded-lg h-[55px] flex items-center'
              />
            </div>
          </form>}


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

      <div className="w-full flex text-right items-end justify-end my-5 gap-4">
        {userType === 'vendor' && (
          <Button
            onClick={handleOpenAddServiceModal}
            Buttonclass="w-[140px] flex item-center justify-around font-normal items-end"
            type="primary"
          >
            Add <AiOutlineFileAdd className="ml-3 w-7 h-7 -mr-[10px] text-3xl font-bold" />
          </Button>
        )}


        <ExportButton
          fileName='service_list'
          method='post'

          api={
            userType === 'vendor'
              ? `/users/${userId}/services/export?${status ? `status=${encodeURIComponent(status)}&` : ''}${serviceName ? `name=${encodeURIComponent(serviceName)}` : ''}`
              : `/services/export?${status ? `status=${encodeURIComponent(status)}&` : ''}${serviceName ? `name=${encodeURIComponent(serviceName)}` : ''}`
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
        title="Delete Service"
        description="Are you sure you want to delete this Service?"
        onConfirm={handleDeleteService}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Block Modal */}
      <ConfirmationModal
        icon={<FaBan className="text-2xl text-[#F40A0A]" />}
        isOpen={isBlockModalOpen}
        onClose={handleCloseBlockModal}
        title="Block Service"
        description="Are you sure you want to block this Service?"
        onConfirm={handleBlock}
        confirmText="Block"
        cancelText="Cancel"
      />

      {/* Confirmation Modal for Edit */}
      <EditConfirmationModal
        icon={<AiOutlineEdit className="text-2xl text-green-500" />}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Update Service"
        description="Are you sure want to Update this Service?"
        onConfirm={handleEdit}
        confirmText="Yes"
        cancelText="No"
      />


      <ViewApproval
        isModalOpen={isViewModalOpen}
        viewData={selectedServiceDetails}
        closeModal={handleCloseViewModal}
      // className="dark:bg-gray-900 dark:text-gray-200"
      />

      <AddService
        isOpen={isAddServiceModalOpen}
        onClose={handleCloseAddServiceModal}
        onSubmit={handleAddService}
      // className="dark:bg-gray-900 dark:text-gray-200"
      />
    </div>
  );
};

export default Servicelist;
