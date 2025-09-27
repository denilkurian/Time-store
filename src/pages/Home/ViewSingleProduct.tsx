import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import { MdArrowBack } from 'react-icons/md';
import EnquireNowButton from '../../components/Enquiry/EnquireNow';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store/store';
import { useDispatch } from 'react-redux';
import { fetchDetails } from '../../redux/feature/Guest/guestApi';
const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

interface ProductOrServiceModelInterface {
    id: string;
    name: string;
    description: string;
    excerpt: string;
    mrp: number;
}

const ViewSingleProduct: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isExcerptExpanded, setIsExcerptExpanded] = useState(false);
    const { id, pageType } = useParams<{ id: string, pageType: string }>();
    const [product, setProduct] = useState<ProductOrServiceModelInterface | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const { singleDetails, loading } = useSelector((state: RootState) => state.guest);
    const [displayPicture, setDisplayPicture] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id && pageType) {
            dispatch(fetchDetails({ id: Number(id), dataType: pageType }));
        }
    }, [dispatch, id, pageType]);

    useEffect(() => {
        if (singleDetails?.data?.attributes) {
            const { relationships, attributes } = singleDetails.data;
            const { name, description, excerpt, mrp } = attributes;
            setProduct({ id: id || '', name, description, excerpt, mrp });
            const displayPicturePath = relationships.images.find(
                (img) => img.id === attributes.display_picture
            )?.attributes.file_path;
            if (displayPicturePath) {
                setDisplayPicture(`${baseUrl}${pageType === 'services' ? 'service_image' : 'product_image'}/thumbnails/640x480-${attributes.display_picture}-${displayPicturePath?.replace(`${pageType === 'services' ? 'service_image/' : 'product_image/'}`, '').replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '.webp')}`);
                setSelectedImage(displayPicture as string)
            }
        }
        if (singleDetails?.data.relationships.images) {
            const formattedimage = singleDetails.data.relationships.images.map((data) => {
                return {
                    id: data.id,
                    path: data.attributes.file_path,
                    smallSizeImages: `${baseUrl}${pageType === 'services' ? 'service_image' : 'product_image'}/thumbnails/200x200-${data.id}-${data.attributes.file_path.replace(`${pageType === 'services' ? 'service_image/' : 'product_image/'}`, '').replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '.webp')}`,
                    mediumSizeImages: `${baseUrl}${pageType === 'services' ? 'service_image' : 'product_image'}/thumbnails/640x480-${data.id}-${data.attributes.file_path.replace(`${pageType === 'services' ? 'service_image/' : 'product_image/'}`, '').replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '.webp')}`
                }
            })
            setImages(formattedimage.map((x) => x.smallSizeImages));
        }
    }, [singleDetails, id]);

    const handleDescriptionToggle = () => setIsDescriptionExpanded((prev) => !prev);
    const handleExcerptionToggle = () => setIsExcerptExpanded((prev) => !prev);
    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return isExcerptExpanded || isDescriptionExpanded
                ? text
                : `${text.slice(0, maxLength)}...`;
        }
        return text;
    };

    return (
        <div className="flex justify-center items-center h-full bg-[#F6EFFF] dark:bg-gray-900 p-4 relative">
            <div className="flex items-center absolute left-5 top-10">
                <button
                    onClick={() => {
                        navigate("/", { state: { pageType: pageType === 'products' ? 'Product' : 'Service' } });
                    }}
                    className="flex items-center justify-center w-12 h-12 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full shadow-lg transition-all duration-300"
                >
                    <MdArrowBack className="text-gray-700 dark:text-gray-200 text-2xl" />
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 py-10 px-2 shadow-md max-w-3xl w-full md:p-6 max-h-[590px] overflow-y-scroll scrollbar-hide">
                <div className='w-full h-4 bg-gray-800 sticky -top-11'></div>
                <div className="flex">
                    {/* Left: Thumbnails */}
                    <div className="md:flex flex-col mr-4 hidden md:visible">
                        {loading ? (
                            Array(5).fill(0).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    variant="rectangular"
                                    width={64}
                                    height={64}
                                    className="mb-2 rounded-md"
                                />
                            ))
                        ) : (
                            images.map((thumb, index) => (
                                <>
                                    {/* <p className='text-white'>{baseUrl}product_image/thumbnails/640x480-11-{thumb.replace('product_image/', '').replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '.webp')}</p> */}
                                    <img
                                        key={index}
                                        src={`${thumb}`}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`w-16 h-16 mb-2 rounded-md cursor-pointer hover:opacity-75 object-cover ${selectedImage === thumb ? "ring-2 ring-blue-500" : ""
                                            }`}
                                        onClick={() => setSelectedImage(thumb)}
                                    />
                                </>
                            ))
                        )}
                    </div>

                    {/* Right: Product Details */}
                    <div className="flex-1">
                        {loading ? (
                            <Skeleton
                                variant="rectangular"
                                width="100%"
                                height={288}
                                className="mb-4 rounded-lg"
                            />
                        ) : (
                            <>
                                {!selectedImage ? (
                                    <div className="w-full h-72 object-contain rounded-lg mb-4 bg-gray-200 flex items-center justify-center">
                                        <h1 className='text-5xl text-gray-300'>No images</h1>
                                    </div>

                                ) : (
                                    <img
                                        src={`${selectedImage.replace('200x200', '640x480')}`}
                                        alt={product?.name || "Product"}
                                        className="w-full h-72 object-contain rounded-lg mb-4"
                                    />
                                )}
                            </>
                        )}

                        {loading ? (
                            <>
                                <Skeleton variant="text" width="70%" height={40} />
                                <Skeleton variant="text" width="90%" height={20} />
                                <Skeleton variant="text" width="80%" height={20} />
                                <Skeleton variant="text" width="13%" height={70} />
                            </>
                        ) : (
                            <>
                                <div className='flex items-center justify-center space-x-5 visible md:hidden my-10'>
                                    {images.map((thumb, index) => (
                                        <img
                                            key={index}
                                            src={`${baseUrl}/${thumb}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            className={`w-16 h-16 mb-2 rounded-md cursor-pointer hover:opacity-75 object-cover ${selectedImage === thumb ? "ring-2 ring-blue-500" : ""
                                                }`}
                                            onClick={() => setSelectedImage(thumb)}
                                        />
                                    ))}
                                </div>
                                <div className="md:p-6 bg-white dark:bg-gray-800">
                                    {/* Product Name */}
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        {product?.name}
                                    </h2>

                                    {/* Product Price */}
                                    <div className="flex items-center space-x-2 text-2xl font-semibold">
                                        <span className='dark:text-white'>Price:</span>
                                        <span className="text-gray-800 dark:text-gray-100">₹{product?.mrp}</span>
                                    </div>

                                    {/* Product Description */}
                                    <div className='max-h-[80px] overflow-y-scroll scrollbar-hide'>
                                        <p className="text-sm dark:text-white text-gray-800 mt-1 whitespace-pre-line overflow-y-auto max-h-60 w-full">
                                            {truncateText(product?.description || 'N/A', 100)}
                                        </p>
                                        {product?.description && product?.description.length > 100 && (
                                            <button
                                                className="text-blue-500 mt-2 text-xs sticky -bottom-[0px] w-full text-start dark:bg-gray-800"
                                                onClick={handleDescriptionToggle}
                                            >
                                                {isDescriptionExpanded ? 'Show Less' : 'Show More'}
                                            </button>
                                        )}
                                    </div>

                                    {product?.excerpt && <div className='max-h-[80px] overflow-y-scroll scrollbar-hide'>
                                        <p className="text-sm dark:text-white text-gray-800 mt-1 whitespace-pre-line overflow-y-auto max-h-60 w-full">
                                            {truncateText(product?.excerpt || 'N/A', 100)}
                                        </p>
                                        {product?.excerpt && product?.excerpt.length > 100 && (
                                            <button
                                                className="text-blue-500 mt-2 text-xs sticky -bottom-[0px] w-full text-start dark:bg-gray-800"
                                                onClick={handleExcerptionToggle}
                                            >
                                                {isExcerptExpanded ? 'Show Less' : 'Show More'}
                                            </button>
                                        )}
                                    </div>}

                                    {/* CTA Buttons */}
                                    <div className="flex space-x-4 mt-3">
                                        <EnquireNowButton
                                            enquirable={{
                                                image: `${displayPicture?.replace('640x480','200x200')}`,
                                                name: product?.name,
                                                type: pageType === 'services' ? 'Service' : 'Product',
                                                id: id,
                                                excerpt: product?.excerpt,
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewSingleProduct;


















