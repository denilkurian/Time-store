import React, { useState, useMemo, useEffect } from 'react';
import Heading from '../../components/Heading/Heading';
import { createMRTColumnHelper, MRT_Row } from 'material-react-table';
import TableComponent from '../../components/Table/TableComponent';
import { useGetUsersQuery, useUpdateUserStatusMutation } from '../../redux/features/users/userApi';
import { Box } from '@mui/material';
import { Button as MUIButton } from '@mui/material';
import { BiBlock } from 'react-icons/bi';
import { ImBlocked } from 'react-icons/im';
import { UserAttributes } from '../../redux/features/users/userModel';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { useDispatch } from 'react-redux';
import ConfirmationModal from './ConfirmationModal';
import { setUser } from '../../redux/features/users/userSlice';
import useCustomToast from '../../hooks/useCustomToast';
import InputField from '../../components/InputField/InputField';
import ExportButton from '../../components/Button/ExportButton';

type Props = {};

const UserManagement: React.FC<Props> = () => {
    const { showToast } = useCustomToast();
    const dispatch = useDispatch();
    const columnHelper = createMRTColumnHelper();
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [queryParams, setQueryParams] = useState<{number: number, email: string, page?: string }>({
        number: 8, email: '', page: '0'
    });
    const { data, error, refetch, isFetching } = useGetUsersQuery(queryParams);
    const [updateUserStatus] = useUpdateUserStatusMutation()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [count, setCount] = useState<number | undefined>(2);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
    useSelector((state: RootState) => state.user.users);
    const [statusIsLoading, setStatusIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (data?.meta.last_page) {
            setCount(data.meta.last_page);
        }
        dispatch(setUser(data));
    }, [data, dispatch]);

    useEffect(() => {
        setCount(data?.meta.last_page);
        setQueryParams({number: Number(phone), email, page: page.toString() });
    }, [email, phone, page]);

    const userData = useMemo(() => {
        return (
            data?.data.map((user, index) => ({
                no: index + 1 + (page - 1) * 10,
                id: user.id,
                user_name: `${user.attributes?.first_name}${user.attributes?.last_name ? ' ' + user.attributes.last_name : ''}`,
                phone_number: user.attributes?.phone,
                email: user.attributes?.email,
                user_type: user.attributes?.type,
                status: user.attributes?.status,
                createdAt: user.attributes.created_at
            })) || []
        );
    }, [data]);

    const handleOpenModal = (row?: any) => {
        setSelectedUserId(row?.original?.id);
        setSelectedUserName(row?.original?.user_name);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleBlock = async () => {
        setStatusIsLoading(true);
        try {
            const blockResponse: { message: string } | any = await updateUserStatus({ userId: selectedUserId, status: 'blocked' }).unwrap();

            if (blockResponse?.message === 'User Blocked Successfully') {
                showToast({ message: `User ${selectedUserName} has been blocked.`, duration: 3000, type: 'error' });
                setStatusIsLoading(false);
            }
            setStatusIsLoading(false);
            refetch();
        } catch (error) {
            setStatusIsLoading(false);
        } finally {
            handleCloseModal();
        }
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        event;
        setPage(newPage);
    };


    const columns = [
        columnHelper.accessor('no', {
            header: 'Sl.No.',
            size: 60,
        }),
        columnHelper.accessor('user_name', {
            header: 'Name',
            size: 40,
        }),
        columnHelper.accessor('phone_number', {
            header: 'Phone Number',
            size: 120,
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            size: 120,
        }),
        columnHelper.accessor('user_type', {
            header: 'User Type',
            size: 100,
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            Cell: ({ cell }) => {
                const status = cell.getValue();
                let statusColor = '';
                const formattedData = status.replace(/_/g, ' ')
                    .replace(/\b\w/g, (char: string) => char.toUpperCase());
                if (status === 'active') {
                    statusColor = 'bg-[#B2FEC2] text-[#527A4D]';
                } else if (status === 'verified') {
                    statusColor = 'bg-green-400 text-[#527A4D]';
                } else if (status === 'blocked' || status === 'Blocked') {
                    statusColor = 'bg-red-500 text-[#ffffff]';
                } else if (status === 'pending_approval') {
                    statusColor = 'bg-[#FCF38F] text-[#7A5A00]';
                } else if (status === 'unverified') {
                    statusColor = 'bg-[#FFE5B4] text-[#8B5E34]';
                }

                return (
                    <div className={`px-3 py-1 rounded-full max-w-[150px] flex items-center justify-center ${statusColor}`}>
                        <p>{formattedData}</p>
                    </div>
                );
            },
            size: 100,
        }),
        columnHelper.accessor('createdAt', {
            header: 'Created At',
            size: 100,
        }),
        {
            accessorKey: 'actions',
            header: 'Actions',
            size: 100,
            Cell: ({ row }: { row: MRT_Row<UserAttributes> }) => (
                <Box sx={{ display: 'flex', gap: '8px' }}>
                    {row.original.status !== "blocked" && <MUIButton
                        onClick={() => handleOpenModal(row)}
                        startIcon={<BiBlock className="text-[#F40A0A]" />}
                    ></MUIButton>}
                </Box>
            ),
        },
    ];

    const handleExportResponse = (response: any) => {
        if (response?.data) {
            console.log('Export successful!', response);
        } else if (response?.error) {
            console.error('Error:', response.error);
        }
    };

    return (
        <div className="bg-[#F6EFFF] dark:bg-gray-900 dark:text-white text-black px-3 py-4 h-full">
            <div className="w-full">
                <Heading title="User Management" welcome="Welcome Admin" />
            </div>
            <div className="my-9 w-full ">
                <form className="flex w-full md:w-[40%]  justify-between space-x-5">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm">
                            Email
                        </label>
                        <InputField
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder='Enter the email id'
                            name='email'
                            className='w-46'
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="phone" className="text-sm">
                            Phone
                        </label>
                        <InputField
                            onChange={(e) => setPhone(e.target.value)}
                            value={phone}
                            placeholder='Enter Phone Number'
                            name='phone'
                            className='w-46'
                        />
                    </div>
                </form>
            </div>
            <div className='w-full flex text-right items-end justify-end my-5'>
                <ExportButton
                    fileName='user_list'
                    isDisabled={isFetching || userData.length === 0}
                    method='get'
                    api={`/users/export?number=${queryParams?.number}&email=${queryParams?.email}`}
                    onExport={handleExportResponse}
                />
            </div>
            <div>
                <TableComponent
                    isPagination={userData.length > 0 ? true : false}
                    columns={columns}
                    data={userData}
                    enableRowSelection={false}
                    isLoading={isFetching}
                    error={error}
                    count={count}
                    onChangePage={handleChangePage}
                />
            </div>
            <div>
                <ConfirmationModal
                    icon={<ImBlocked className='text-2xl text-[#F40A0A]' />}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title='Block User'
                    description='Are you sure you want to block this user?'
                    onConfirm={handleBlock}
                    confirmText={`${statusIsLoading ? 'Blocking . . .' : 'Block'}`}
                    cancelText="Cancel"
                />
            </div>
        </div>
    );
};

export default UserManagement;
