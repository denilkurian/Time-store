import React, { useEffect, useState } from 'react'
import CommonCards from '../../components/Card/CommonCard'
import { ProductListingInterface } from '../../redux/feature/products/productModel'
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { AppDispatch, RootState } from '../../redux/store/store';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchGuestProductDetails } from '../../redux/feature/Guest/guestApi';

const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
const Url = import.meta.env.VITE_BASE_URL;
interface Filters {
    category: string,
    minPrice: number | null,
    maxPrice: number | null,
    minOrder: number | null,
}

type Props = {
    filters: Filters;
    name: string
}

const ProductPage: React.FC<Props> = ({ filters, name }) => {
    const dispatch = useDispatch<AppDispatch>();
    // const { productApiResponse } = useSelector((state: RootState) => state.guest)
    const [productList, setProductList] = useState<ProductListingInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    const handleViewDetails = (id: number) => {
        navigate(`/view-product/${id}/products`);
    };

    useEffect(() => {
        dispatch(fetchGuestProductDetails({ page: currentPage, filters, name }));
    }, [dispatch, currentPage, filters, name]);

    useEffect(() => {
        const fetchProducts = async (page: number) => {
            setLoading(true);
            try {
                const payload = {
                    data: {
                        attributes: {
                            min_price: filters.minPrice || null,
                            max_price: filters.maxPrice || null,
                            min_order: filters.minOrder || null,
                            category: filters.category || null,
                            name
                        },
                    },
                };
                const productResponse = await axios.post(`${Url}/public/products?page=${page}`, payload);
                const productData = productResponse.data.data;
                setTotalPages(Number(productResponse.data.meta.last_page))
                const formattedProducts = productData.map((product: any) => {
                    const productAttributes = product.attributes;

                    const images =
                        product.relationships?.images?.map((image: any) => {
                            return `${baseUrl}/${image.attributes.file_path}`;
                        }) || ["default-image-url.jpg"];
                    const displayPicture = product.relationships?.images?.find(
                        (img: any) => img.id === productAttributes.display_picture
                    );
                    return {
                        id: product.id,
                        name: productAttributes.name,
                        description: productAttributes.description,
                        mrp: productAttributes.mrp,
                        display_picture: displayPicture
                            ? `${baseUrl}/product_image/thumbnails/200x200-${displayPicture.id}-${displayPicture.attributes.file_path
                                .replace('product_image/', '')
                                .replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '.webp')}`
                            : null,
                        images: images,
                    };
                });
                setProductList(formattedProducts);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts(currentPage);
    }, [filters, currentPage, name]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        event;
        setCurrentPage(value);
    };

    return (
        <div className='bg-[#F6EFFF] dark:bg-gray-900 dark:text-white text-black flex flex-col items-center'>
            <h1 className='font-bold mb-4'>Products</h1>
            {productList?.length > 0 &&
                <div className='mt-5 sticky top-12 py-3 bg-[#F6EFFF] dark:bg-gray-900 w-full flex justify-center z-40'>
                    <Stack spacing={2} direction="column-reverse" alignItems="center">
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
                </div>}
            <div className='flex justify-center w-full'>
                {!loading ? (
                    productList.length > 0 ? (
                        <div className='flex flex-wrap items-center justify-center'>
                            {productList?.map((product) => (
                                <CommonCards
                                type='Product'
                                    key={product.id}
                                    product_id={product.id}
                                    isLoading={loading}
                                    isButtonRequired={true}
                                    title={product.name}
                                    displayPicture={product.display_picture}
                                    excerpt={product.excerpt}
                                    price={product.mrp}
                                    images={product.images}
                                    onViewDetails={() => handleViewDetails(product.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-[355px] ">
                            <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                                No Products Available
                            </h2>
                            <p className="text-gray-500 dark:text-gray-500 mb-4">
                                Sorry, we couldn’t find any products at the moment.
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

export default ProductPage;