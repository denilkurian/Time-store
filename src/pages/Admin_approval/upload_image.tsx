import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";

type Props = {
  viewData: any;
};

const UploadImagesTab: React.FC<Props> = ({ viewData }) => {
  const [productImages, setProductImages] = useState<string[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const baseImageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoadingDocs(true);
        if (viewData.type === 'Product') {

          const response = await axiosInstance.get(`products/${viewData.product_id}/images`);
          if (response.data?.status === "success") {
            const images = response.data?.data?.map((img: any) => img.attributes?.file_path) || [];
            setProductImages(images);
          }

        }
        if (viewData.type === 'Service') {
          const response = await axiosInstance.get(`services/${viewData.product_id}/images`);
          if (response.data?.status === "success") {
            const images = response.data?.data?.map((img: any) => img.attributes?.file_path) || [];
            setProductImages(images);
          }

        }

      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchImages();
  }, [viewData]);

  return (
    <div className="bg-lightmode m-2 p-10 rounded-lg dark:bg-gray-900 min-h-[60vh] max-w-[60vw] overflow-auto">
      {(viewData?.type === "Product" || viewData?.type === "Service") && (
        <div className="m-2 p-4 rounded-md dark:text-white">
          {loadingDocs ? (
            <p>Loading...</p>
          ) : productImages.length === 0 ? (
            <p>No images available</p>
          ) : (
            <div className="grid grid-cols-3 gap-4 max-h-[50vh]">
              {productImages.map((imgPath, index) => (
                <div key={index} className="w-full h-60">
                  <img
                    src={`${baseImageUrl}${imgPath}`}
                    alt={`Product ${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadImagesTab;
