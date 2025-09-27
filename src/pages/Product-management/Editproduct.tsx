import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Details from "./Details";
import UploadImages from "./UploadImages";
import Tabs, { Tab } from "../../components/Tab/Tab";
import ApprovalButton from "../../components/Button/ApprovalButton";
import { MdArrowBack } from "react-icons/md"; 

const EditProduct: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const productId = location.state?.productId;
    const { productId, status } = location.state || {};
  
    console.log("productId:", productId);
    console.log("status:", status);


  return (
    <div className="p-6 bg-[#F6EFFF] dark:bg-gray-900 dark:text-white text-black px-3 py-4 h-full overflow-scroll overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      {/* Back Button */}
      <button
        onClick={() => {
          navigate("/product-management", { state: { pageType: 'Product' } }); 
        }}
        className="flex items-center justify-center w-12 h-12 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full shadow-lg transition-all duration-300 mb-4"
      >
        <MdArrowBack className="text-gray-700 dark:text-gray-200 text-2xl" />
      </button>

      <div className="relative">
        <div className="absolute top-0 right-2">
        <ApprovalButton
        type="Product"
            entity="Product" 
            purpose={status === "revision" ? "product_service_reapproval" : "product_service_approval"} 
            id={productId || 0}
             url="/product-management"
          />
        </div>
      </div>

      <Tabs>
        <Tab
          label="Details"
          content={
            <div className="scrollable-container">
              <Details productId={productId} />
            </div>
          }
        />
        <Tab
          label="Upload Images"
          content={
            <div className="scrollable-container">
              <UploadImages />
            </div>
          }
        />
      </Tabs>
    </div>
  );
};

export default EditProduct;
