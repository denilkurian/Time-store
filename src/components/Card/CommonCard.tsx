import React from "react";
import EnquireNowButton from "../Enquiry/EnquireNow";

interface CardProps {
    isLoading?: boolean;
    isButtonRequired: boolean;
    product_id: number;
    title: string;
    description?: string;
    excerpt?: string;
    price: number;
    displayPicture: string;
    images?: string[];
    selectedImage?: string;
    type?: string;
    onViewDetails: () => void;
}

const CommonCards: React.FC<CardProps> = ({
    product_id,
    title,
    excerpt,
    price,
    displayPicture,
    // images = [],
    onViewDetails,
    type
}) => {
    // const defaultImage = "https://via.placeholder.com/150";
    // const totalSlots = 4;

    // const filledImages = [
    //     ...(displayPicture ? [displayPicture] : []),
    //     ...images,
    // ].slice(0, totalSlots);

    // const [selectedImage, setSelectedImage] = useState(filledImages[0] || defaultImage);

    return (
        <div className="w-80 h-[300px] bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col items-center mt-2 me-5">
            {/* Image Section */}
            <div
                className="h-40 w-full flex items-center justify-center border-b border-gray-200 dark:border-0 overflow-hidden"
                role="button"
                onClick={onViewDetails}
            >
                {displayPicture ? (
                    <img
                        loading="lazy"
                        src={displayPicture}
                        alt={title}
                        className="h-full max-w-full object-cover"
                    />
                ) : (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-56 flex items-center justify-center text-lg font-semibold text-gray-400">
                        200x200
                    </div>
                )}
            </div>

            {/* Title and Description */}
            <div
                className="text-center my-4"
                role="button"
                onClick={onViewDetails}
            >
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-gray-500 truncate w-[200px]">{excerpt}</p>
                <p className="text-lg font-bold text-black dark:text-gray-100">₹{price}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
                <div>
                    <EnquireNowButton
                        enquirable={{
                            image: displayPicture,
                            name: title,
                            type: type,
                            id: product_id,
                            excerpt: excerpt,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CommonCards;
