import { useEffect, useState } from 'react';
import Heading from '../../components/Heading/Heading';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import TableComponent from '../../components/Table/TableComponent';
import { createMRTColumnHelper } from 'material-react-table';
import { AiOutlineEye, AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store/store';
import { fetchApprovals, Filters } from '../../redux/reducer/approvalSlice';
import { useApproveStatusMutation, useRejectStatusMutation } from '../../redux/features/Approvals/approvalApi';
import useCustomToast from '../../hooks/useCustomToast';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axiosInstance from '../../utils/axiosConfig';
import ViewApproval from './view_approval';
import ExportButton from '../../components/Button/ExportButton';
import { CircularProgress } from '@mui/material';

dayjs.extend(isSameOrAfter);

const AdminApproval = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [requestLoading, setRequestLoading] = useState(false)
  // const navigate = useNavigate();
  const { showToast } = useCustomToast();
  const [modalOpen, setModalOpen] = useState<{ type: string; open: boolean }>({ type: '', open: false });
  const [reason, setReason] = useState('');
  const [purposeOptions, setPurposeOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [typeOptions, setTypeOptions] = useState<string[]>([]); // Add typeOptions state
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewData, setViewData] = useState();
  const [filter, setFilter] = useState<Filters>({
    page: 1,
    purpose: '',
    status: "awaiting",
    type: "",
    startDate: "",
    endDate: ""
  })
  // const [page, setPage] = useState<number>(1);
  const { data, loading, fullApprovalData } = useSelector((state: RootState) => state.approvals);
  const [approveStatus] = useApproveStatusMutation();
  const [rejectStatus] = useRejectStatusMutation();
  const [count, setCount] = useState(1);
  const { darkMode } = useSelector((state: RootState) => state.theme)
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(fetchApprovals(filter));
    fetchEnums();
    setCount(fullApprovalData.meta?.last_page);
    console.log(filter)
  }, [dispatch, filter]);

  useEffect(() => {
    if (fullApprovalData?.meta?.last_page) {
      setCount(fullApprovalData.meta.last_page);
    }
  }, [fullApprovalData, loading, data]);

  const fetchEnums = async () => {
    try {
      const [purposeResponse, statusResponse, typeResponse] = await Promise.all([
        axiosInstance.get('/enums/ApprovalPurpose'),
        axiosInstance.get('/enums/ApprovalStatus'),
        axiosInstance.get('/enums/ApprovedEntities'), // Fetch types
      ]);
      setPurposeOptions(purposeResponse.data.data.attributes);
      setStatusOptions(statusResponse.data.data.attributes);
      setTypeOptions(typeResponse.data.data.attributes); // Set types
    } catch (error) {
      console.error('Error fetching enums:', error);
    }
  };



  const handleApprove = async () => {
    if (!selectedRow) return;

    const apiBody = {
      id: selectedRow.id,
      purpose: selectedRow.purpose,
      approvable_id: selectedRow.approvable_id,
      approvable_type: selectedRow.approvable,
    };

    try {
      setRequestLoading(true)
      const response = await approveStatus(apiBody).unwrap();
      showToast({ message: response.message, type: response.status === 'success' ? 'success' : 'error' });
      dispatch(fetchApprovals(filter));
    } catch (error) {
      console.error('Error approving request:', error);
      showToast({ message: 'Failed to approve request.', type: 'error' });

    }
    setModalOpen({ type: '', open: false });
    setRequestLoading(false)
  };

  const handleReject = async () => {
    if (!selectedRow) return;

    const apiBody = {
      id: selectedRow.id,
      purpose: selectedRow.purpose,
      approvable_id: selectedRow.approvable_id,
      approvable_type: selectedRow.approvable,
      reason,
    };

    try {
      setRequestLoading(true)
      const response = await rejectStatus(apiBody).unwrap();
      showToast({ message: response.message, type: response.status === 'success' ? 'success' : 'error' });
      dispatch(fetchApprovals(filter));
    } catch (error) {
      console.error('Error rejecting request:', error);
      showToast({ message: 'Failed to reject request.', type: 'error' });
    }
    setModalOpen({ type: '', open: false });
    setReason('');
    setRequestLoading(false)
  };

  const handleAction = (action: string, row: any) => {
    setSelectedRow(row);
    if (action === 'View Profile') {
      setViewData(row);
      setIsModalOpen(true);
    } else {
      setModalOpen({ type: action, open: true });
    }
  };

  const formatString = (str: string): string => {
    return str
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/Product Service /, 'Product / Service ');
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setFilter({ ...filter, page: newPage });
  };


  const columns = [
    createMRTColumnHelper().accessor('serial_number', {
      header: 'Sl.No.',
      size: 60,
      Cell: ({ row }) => row.index + 1,
    }),
    createMRTColumnHelper().accessor('name', { header: 'Name', size: 150 }),
    createMRTColumnHelper().accessor('type', { header: 'Type', size: 150 }),
    createMRTColumnHelper().accessor('purpose',
      {
        header: 'Purpose',
        size: 150,
        Cell: ({ cell }) => {
          const purpose = cell.getValue();
          const formattedData = formatString(purpose)
          return <div>{formattedData}</div>;

        }
      }),
    createMRTColumnHelper().accessor('status', {
      header: 'Status',
      Cell: ({ cell }) => {
        const status = cell.getValue();
        let statusColor = '';
        if (status === 'approved') statusColor = 'bg-[#B2FEC2] text-[#527A4D]';
        else if (status === 'awaiting') statusColor = 'bg-[#FCF38F] text-[#527A4D]';
        else if (status === 'rejected') statusColor = 'bg-[#FEC2C2] text-[#7A4D4D]';
        return <div className={`px-4 py-2 rounded-full ${statusColor}`}>{status}</div>;
      },
    }),
    createMRTColumnHelper().accessor('created_at', {
      header: 'Date & Time',
      Cell: ({ cell }) => {
        const date = new Date(cell.row.original.created_at);
        const formattedDate = dayjs(date).format('DD-MM-YYYY h:mm A');
        return <span>{formattedDate}</span>;
      },
      size: 120,
    }),

    createMRTColumnHelper().accessor('actions', {
      header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleAction('View Profile', row.original)}
            className="text-blue-500 hover:text-blue-700"
            title="View Profile"
          >
            <AiOutlineEye className="w-5 h-5" />
          </button>
          {row.original.status !== 'approved' && row.original.status !== 'rejected' && (
            <>
              <button
                onClick={() => handleAction('Approve', row.original)}
                className="text-green-500 hover:text-green-700"
                title="Approve"
              >
                <AiOutlineCheckCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleAction('Reject', row.original)}
                className="text-red-500 hover:text-red-700"
                title="Reject"
              >
                <AiOutlineCloseCircle className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      ),
    }),
  ];

  const handleExportResponse = (response: any) => {
    if (response?.data) {
      console.log('Export successful!', response);
    } else if (response?.error) {
      console.error('Error:', response.error);
    }
  };

  return (
    <div className="bg-[#F6EFFF] dark:bg-gray-900 min-h-screen py-6 px-8">
      <Heading className="mt-5 pt-5" title="Approvals" welcome="Welcome Admin" />
      {/* Filters Section */}
      <div className="my-6">
        <div className="flex gap-6 ">
          <FormControl fullWidth sx={{ width: 150 }}>
            <InputLabel className='dark:text-white w-[200px]' shrink>
              Purpose
            </InputLabel>
            <Select
              value={filter.purpose}
              onChange={(e) => setFilter({ ...filter, purpose: e.target.value })}
              label={filter.purpose === "" ? "All" : "Purpose"}
              className='dark:bg-gray-800 dark:text-white'
              displayEmpty
            >
              <MenuItem value="">All</MenuItem>
              {purposeOptions.map((purpose) => (
                <MenuItem key={purpose} value={purpose}>
                  {formatString(purpose)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ width: 150 }}>
            <InputLabel className='dark:text-white' shrink>Status</InputLabel>
            <Select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              label="Status"
              className='dark:bg-gray-800 dark:text-white' displayEmpty
            >
              <MenuItem value="">All</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {formatString(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ width: 150 }}>
            <InputLabel className='dark:text-white' shrink>Type</InputLabel>
            <Select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              label="Type"
              className='dark:bg-gray-800 dark:text-white' displayEmpty
            >
              <MenuItem value="">All</MenuItem>
              {typeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  {formatString(type)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            type="date"
            value={dayjs(filter.startDate).format('YYYY-MM-DD')}
            onChange={(e) => setFilter({ ...filter, startDate: new Date(e.target.value).toString() })}
            InputLabelProps={{
              shrink: true,
              style: {
                color: darkMode ? 'white' : 'gray',
              },
            }}
            InputProps={{
              style: {
                color: darkMode ? 'white' : 'gray',

              },
            }}
            className='dark:bg-gray-800 dark:text-white'
          />
          <TextField
            label="End Date"
            type="date"
            value={dayjs(filter.endDate).format('YYYY-MM-DD')}
            onChange={(e) => setFilter({ ...filter, endDate: new Date(e.target.value).toString() })}
            InputLabelProps={{
              shrink: true,
              style: {
                color: darkMode ? 'white' : 'gray',
              },
            }} className='dark:bg-gray-800 dark:text-white'
            InputProps={{
              style: {
                color: darkMode ? 'white' : 'gray'
              },
            }}
          />
        </div>
      </div>
      {/* Export Button */}
      <div className='w-full flex text-right items-end justify-end my-5'>
        <ExportButton
          fileName='approval_list'
          isDisabled={loading || data.length === 0}
          method='post'
          api={`/approvals/export`}
          onExport={handleExportResponse}
        />
      </div>

      {/* Table Component */}
      <TableComponent isPagination={true} columns={columns} data={data} isLoading={loading} count={count} onChangePage={handleChangePage} />

      {/* Modal Component */}
      {['Approve', 'Reject'].map((action) => (
        <Modal
          key={action}
          open={modalOpen.type === action}
          onClose={() => setModalOpen({ type: '', open: false })}
          className="flex justify-center items-center"
        >
          <Box className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">{action} Request</h2>
            {requestLoading ?
              <div className='flex justify-center items-center'> <CircularProgress className="flex items-center text-black  dark:text-white " color="inherit" size={50} thickness={2} /></div>
              : <>
                {action === 'Reject' && (
                  <TextField
                    className='dark:bg-gray-800'
                    label="Reason for Rejection"
                    fullWidth
                    multiline
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    inputProps={{
                      style: {
                        color: darkMode ? 'white' : 'black'
                      }
                    }}
                    InputLabelProps={{
                      style: {
                        color: darkMode ? 'white' : 'black'
                      }
                    }}
                  />
                )}
                <div className="flex justify-end gap-4 mt-6 dark:bg-gray-900">
                  <Button variant="outlined" onClick={() => setModalOpen({ type: '', open: false })}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color={action === 'Approve' ? 'primary' : 'error'}
                    onClick={action === 'Approve' ? handleApprove : handleReject}
                    disabled={action === 'Reject' && !reason.trim()}
                  >
                    {action === 'Approve' ? 'Confirm' : 'Reject'}
                  </Button>
                </div>
              </>}  </Box>
        </Modal>
      ))}
      <ViewApproval isModalOpen={isModalOpen} viewData={viewData} closeModal={closeModal} />
    </div>
  );
};

export default AdminApproval;