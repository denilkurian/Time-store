import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchServiceDetails } from '../../redux/feature/Guest/guestApi';
import { Pagination, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CommonCards from '../../components/Card/CommonCard';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
interface Filters {
    category: string,
    minPrice: number | null,
    maxPrice: number | null,
    minOrder: number | null,
}

type Props = {
    filters: Filters,
    name: string
}

const ServicePage: React.FC<Props> = ({ filters, name }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, serviceResponse, serviceListAttributes } = useSelector((state: RootState) => state.guest);
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [service, setService] = useState<{
        id: number
        name: string | null;
        mrp: number | null;
        display_picture: string | null;
        description: string | null
        images: string[] | null;
    }[]>([]);


    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        event;
        setCurrentPage(value);
    };

    const handleViewDetails = (id: number) => {
        navigate(`/view-product/${id}/services`);
    };

    useEffect(() => {
        dispatch(fetchServiceDetails({ page: currentPage, filters, name }));
    }, [dispatch, currentPage, filters, name]);

    useEffect(() => {
        if (serviceResponse?.data) {
            const formattedData = serviceResponse.data.map((service) => {
                const serviceAttributes = service.attributes;
                const images = service?.relationships?.images?.map((image) => {
                    return `${baseUrl}${image.attributes.file_path}`;
                });
                const displayPicture = service.relationships?.images?.find(
                    (img: any) => img.id === serviceAttributes.display_picture
                );
                return {
                    id: service.id as number,
                    name: serviceAttributes.name as string,
                    description: serviceAttributes.description as string,
                    mrp: serviceAttributes.mrp as number,
                    display_picture: displayPicture
                        ? `${baseUrl}/service_image/thumbnails/200x200-${displayPicture.id}-${displayPicture.attributes.file_path
                            .replace('service_image/', '')
                            .replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '.webp')}`
                        : null,
                    images: images as string[],
                };
            }) || [];
            setService(formattedData);
            setTotalPages(serviceResponse.meta.last_page as number);
        }
    }, [serviceResponse, name]);
    return (
        <div className="bg-[#F6EFFF] dark:bg-gray-900 dark:text-white text-black flex flex-col items-center">
            <h1 className="font-bold mb-4">Services</h1>
            {serviceListAttributes?.length > 0 && (
                <div className="mt-5 sticky top-12 py-3 bg-[#F6EFFF] dark:bg-gray-900 w-full flex justify-center z-40">
                    <Stack spacing={2}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            shape="rounded"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: darkMode ? '#FFFFFF' : '#000000',
                                },
                                '& .MuiPaginationItem-root.Mui-selected': {
                                    backgroundColor: darkMode ? '#6056E6' : '#1976d2',
                                    color: '#FFFFFF',
                                },
                                '& .MuiPaginationItem-root.Mui-selected:hover': {
                                    backgroundColor: darkMode ? '#4C46B8' : '#145CA8',
                                },
                                '& .MuiPaginationItem-ellipsis': {
                                    color: darkMode ? '#BBBBBB' : '#666666',
                                },
                            }}
                        />
                    </Stack>
                </div>
            )}
            <div className="flex justify-center w-full">
                {!loading ? (
                    service.length > 0 ? (
                        <div className="flex flex-wrap items-center justify-center">
                            {service.map((service) => (
                                <CommonCards
                                    type='Service'
                                    key={service.id}
                                    product_id={service.id}
                                    isLoading={loading}
                                    isButtonRequired={true}
                                    title={service.name as string}
                                    displayPicture={service.display_picture as string}
                                    // excerpt={service?.excerpt as string}
                                    price={service.mrp as number}
                                    images={service.images as string[]}
                                    onViewDetails={() => handleViewDetails(service.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-[355px] bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                                No Services Available
                            </h2>
                            <p className="text-gray-500 dark:text-gray-500 mb-4">
                                Sorry, we couldn’t find any Services at the moment.
                            </p>
                        </div>

                    )
                ) : (
                    <div className="flex flex-wrap justify-center gap-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="w-80 h-[300px] bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center mt-2 me-5">
                                {/* Image Skeleton */}
                                <Box className="h-40 w-full flex items-center justify-center border-b border-gray-200 dark:border-0 overflow-hidden">
                                    <Skeleton variant="rectangular" width="100%" height="100%" />
                                </Box>

                                {/* Title and Description Skeleton */}
                                <Box className="text-center my-4 w-full flex flex-col items-center">
                                    <Skeleton variant="text" width="80%" height={30} />
                                    <Skeleton variant="text" width="35%" height={30} />
                                </Box>

                                {/* Action Buttons Skeleton */}
                                <Box className="flex gap-2 justify-center w-full">
                                    <Skeleton variant="rectangular" width={120} height={36} />
                                </Box>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicePage;