import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table/TableComponent";
import { Box, FormControl, InputLabel, MenuItem, TextField, Select } from "@mui/material";
import InputField from "../../components/InputField/InputField";
import axiosInstance from "../../utils/axiosConfig";
import Heading from "../../components/Heading/Heading";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { EnquiryView } from "./EnquiryView";
import ConfirmationModal from "../User Management/ConfirmationModal";
import { FaTrashAlt } from "react-icons/fa";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import ExportButton from "../../components/Button/ExportButton";
import useCustomToast from "../../hooks/useCustomToast";

interface RowData {
    original: {
        date: string;
        id: number;
        read: number;
    };
}



export const EnquiryList: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [count, setCount] = useState<number>(0);
    const { showToast } = useCustomToast();

    // Filter states
    const [filteredEmail, setFilteredEmail] = useState('')
    const [filteredphone, setFilteredPhone] = useState('')
    const [type, setType] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const { darkMode } = useSelector((state: RootState) => state.theme)
    // Fetch enquiries with product names mapped
    const fetchEnquiry = async (currentPage: number = 1) => {

        try {
            let response;
            setLoading(true);
            if (filteredEmail || filteredphone || type || startDate || endDate) {
                response = await axiosInstance.get(`enquiries?type=${type}&email=${filteredEmail}&phone=${filteredphone}&data[attributes][from_date]=${startDate}&data[attributes][to_date]=${endDate}`);
                console.log("Result Published", type)
            }
            else {
                response = await axiosInstance.get(`/enquiries?page=${currentPage}`);
            }
            const apiData = response.data;

            const perPage = apiData.meta.per_page; // Items per page
            const formattedData = apiData.data.map((item: any, index: number) => ({
                no: (currentPage - 1) * perPage + index + 1, // Calculate the correct serial number
                id: item.id,
                product_name: item.attributes.item_name,
                enquirer_name: item.attributes.name,
                email: item.attributes.email,
                phone: item.attributes.phone,
                message: item.attributes.message,
                date: item.attributes.created_at,
                read: item.attributes.read
            }));

            setData(formattedData);
            setCount(apiData.meta.last_page);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = async (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
        await fetchEnquiry(newPage);
    };

    useEffect(() => {
        fetchEnquiry(page);
    }, [page, filteredEmail, filteredphone, type, startDate, endDate]);


    // New
    const [selectedEnquiryId, setSelectedEnquiryId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);


    // Api for read enquiry

    const readEnquiry = async (enquiry_id: string) => {
        try {
            await axiosInstance.post(`enquiries/${enquiry_id}/read`)
            // console.log('response', response.data)
        }
        catch (error) {
            // console.log('error')
        }
        finally {
            // console.log('finished')
        }
    }

    // View
    const handleViewProduct = (product: any) => {
        if (product.read === 0) {
            readEnquiry(product.id)
            fetchEnquiry()
            console.log('Readed')
        }
        setSelectedEnquiry(product);
        setIsViewModalOpen(true);

    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);

    };

    // Delete
    const handleOpenDeleteModal = (id: number) => {
        setSelectedEnquiryId(id);
        setIsDeleteModalOpen(true);
    };
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };


    const columns = React.useMemo(
        () => [
            { accessorKey: "no", header: "Sl. No", size: 100, },
            { accessorKey: "product_name", header: "Product/Service" },
            { accessorKey: "enquirer_name", header: "Enquirer Name" },
            { accessorKey: "email", header: "Email" },
            { accessorKey: "phone", header: "Phone No" },
            {
                accessorKey: 'date',
                header: 'Date & Time',
                Cell: ({ row }: { row: RowData }) => {
                    const date = new Date(row.original.date);
                    const formattedDate = dayjs(date).format('DD-MM-YYYY h:mm A');
                    return <span>{formattedDate}</span>;
                  },
            },
            {
                accessorKey: "Actions", header: "Actions",
                Cell: ({ row }) => (
                    <Box sx={{ display: 'flex', gap: '22px' }}>
                        {/* View Product */}


                        <button
                            onClick={() => handleViewProduct(row.original)}
                            className="text-blue-500 hover:text-blue-700"
                            title="View"
                        >
                            <AiOutlineEye className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => handleOpenDeleteModal(row.original.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                        >
                            <AiFillDelete className="w-5 h-5" />
                        </button>
                        {(row.original.read === 0) ? '' : <button className="text-green-400"><i>Viewed</i></button>}
                    </Box>
                )

            },
        ],
        []
    );


    const handleExportResponse = (response: any) => {
        if (response?.data) {
            console.log('Export successful!', response);
        } else if (response?.error) {
            console.error('Error:', response.error);
        }
    };


    const handleDeleteEnquiry = async () => {
        if (!setSelectedEnquiryId) return;

        try {
            await axiosInstance.delete(`/enquiries/${selectedEnquiryId}`);
            showToast({ message: 'Enquiry deleted successfully', duration: 3000, type: 'success' });
            // Refresh product data after deletion
            fetchEnquiry();
        } catch (error) {
            showToast({ message: 'Failed to delete Enquiry', duration: 3000, type: 'error' });
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="bg-[#F6EFFF] dark:bg-gray-900 dark:text-white text-black px-3 py-4 h-full overflow-scroll overflow-x-hidden">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Heading className="mt-5 pt-5" title="Enquiry List" />
            </Box>


            {/* Filters Section */}
            <div className="my-6">
                <div className="flex gap-6 ">

                    <div className="flex flex-col">
                        {/* <label htmlFor="phone" className="text-sm">
                                Enquirer
                            </label> */}
                        <InputField
                            onChange={(e) => setFilteredPhone(e.target.value)}
                            value={filteredphone}
                            placeholder='Enter Phone'
                            name='phone'
                            className='bg-[#D7CFCF80] dark:bg-gray-800 rounded-lg h-[50px] flex items-center'
                        />
                    </div>
                    <div className="flex flex-col">
                        {/* <label htmlFor="phone" className="text-sm">
                                Email
                            </label> */}
                        <InputField
                            onChange={(e) => setFilteredEmail(e.target.value)}
                            value={filteredEmail}
                            placeholder='Enter Email'
                            name='phone'
                            className='bg-[#D7CFCF80] dark:bg-gray-800 rounded-lg h-[50px] flex items-center'
                        />
                    </div>


                    <FormControl fullWidth sx={{ width: 150 }}>
                        <InputLabel className='dark:text-white' shrink>Type</InputLabel>
                        <Select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            label="Type"
                            className='dark:bg-gray-800 dark:text-white' displayEmpty
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="App\Models\Service">Service</MenuItem>
                            <MenuItem value="App\Models\Product">Product</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate ? dayjs(startDate).format('YYYY-MM-DD') : ''}
                        onChange={(e) => {
                            const selectedDate = e.target.value;
                            setStartDate(selectedDate); // Store the date as an ISO string
                        }}
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
                        value={endDate ? dayjs(endDate).format('YYYY-MM-DD') : ''}
                        onChange={(e) => {
                            const selectedDate = e.target.value;
                            setEndDate(selectedDate); // Store the date as an ISO string
                        }}
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
                </div>
            </div>


            <div className="w-full flex text-right items-end justify-end my-5 gap-4">
                <ExportButton
                    fileName='enquiry_list'
                    isDisabled={loading || data.length === 0}
                    method='post'
                    api={`enquiries/export?type=${type}&email=${filteredEmail}&phone=${filteredphone}&data[attributes][from_date]=${startDate}&data[attributes][to_date]=${endDate}`}
                    onExport={handleExportResponse}
                />


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

            <EnquiryView data={selectedEnquiry} isViewModalOpen={isViewModalOpen} handleCloseViewModal={handleCloseViewModal} />

            <ConfirmationModal
                icon={<FaTrashAlt className="text-2xl text-[#F40A0A]" />}
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                title="Delete Enquiry"
                description="Are you sure you want to Delete this Enquiry?"
                onConfirm={handleDeleteEnquiry}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};
