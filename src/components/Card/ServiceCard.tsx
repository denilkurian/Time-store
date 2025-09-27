import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import EnquireNowButton from "../Enquiry/EnquireNow";

interface CardProps {
    isLoading?: boolean;
    isButtonRequired?: boolean;
    serviceId?: number;
    name?: string;
    description?: string;
    excerpt?: string;
    price?: number;
    displayPicture?: string;
    images?: string[];
    onViewDetails?: () => void;
}

const ServiceCard: React.FC<CardProps> = ({
    isLoading,
    // isButtonRequired,
    serviceId,
    name,
    excerpt,
    price,
    displayPicture,
    images = [],
    onViewDetails,
}) => {
    const [selectedImage, setSelectedImage] = useState(
        displayPicture || "https://via.placeholder.com/150"
    );
    const totalSlots = 4;

    return (
        <div className="group relative w-80 bg-white dark:bg-gray-800 rounded-md overflow-hidden z-10">
            {/* Image Section */}
            <div role="button" onClick={onViewDetails}>
                <div className="relative">
                    <img
                        src={selectedImage}
                        alt={name}
                        className="w-full h-48 object-cover hover:scale-[0.9] transition-all duration-300 ease-in-out"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 bg-white dark:bg-gray-700 px-3 py-1 rounded-full shadow-lg text-black dark:text-gray-100 font-semibold text-sm backdrop-blur-md bg-opacity-60">
                        ₹{price}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 text-center">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
                        {name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                        {excerpt}
                    </p>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center gap-2 mb-3">
                {isLoading
                    ? Array(totalSlots)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton
                                key={index}
                                height={40}
                                width={40}
                                borderRadius={8}
                                className="rounded-md"
                            />
                        ))
                    : [displayPicture, ...images].slice(0, totalSlots).map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt="Thumbnail"
                            className={`h-10 w-10 object-cover rounded-md cursor-pointer border-2 ${selectedImage === image
                                ? "border-blue-500"
                                : "border-gray-300 hover:border-gray-500"
                                }`}
                            onClick={() => setSelectedImage(image as string)}
                        />
                    ))}
            </div>

            {/* Buttons */}
            <div className="px-4 pb-4 flex gap-3 justify-center">
                {/* {isButtonRequired && (
                    <Button
                        onClick={onViewDetails}
                        Buttonclass="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
                        type="primary"
                    >
                        Details
                    </Button>
                )} */}
                <EnquireNowButton
                    enquirable={{
                        name: name,
                        type: "Service",
                        id: serviceId,
                        excerpt: excerpt,
                    }}
                />
            </div>
        </div>
    );
};

export default ServiceCard;
