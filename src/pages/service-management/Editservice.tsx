import React from "react";
import ServiceDetails from "../../pages/service-management/ServiceDetails";
import Serviceimages from "../../pages/service-management/Serviceimages";
import Tabs, { Tab } from "../../components/Tab/Tab";
import { useNavigate, useLocation } from "react-router-dom";
import ApprovalButton from "../../components/Button/ApprovalButton";
import { MdArrowBack } from "react-icons/md";

const Editservice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract serviceId and status from location state
  const { serviceId, status } = location.state || {};
  
  // console.log("serviceId:", serviceId);
  // console.log("status:", status);
  // const handleSubmit = (formData: any) => {
  //   console.log("Form Data submitted:", formData);
  // };

  return (
    <div className="p-6 bg-[#F6EFFF] dark:bg-gray-900 dark:text-white text-black px-3 py-4 h-full overflow-scroll overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-4">Edit Service</h1>

      {/* Back Button */}
      <button
        onClick={() => {
          navigate("/service-management", { state: { pageType: "Product" } }); // Navigate to service management
        }}
        className="flex items-center justify-center w-12 h-12 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full shadow-lg transition-all duration-300 mb-4"
      >
        <MdArrowBack className="text-gray-700 dark:text-gray-200 text-2xl" />
      </button>

      <div className="relative">
        <div className="absolute top-0 right-2">
          <ApprovalButton
            type="Service"
            entity="Service"
            purpose={status === "revision" ? "product_service_reapproval" : "product_service_approval"}
            id={serviceId || 0}
            url="/service-management"
          />
        </div>
      </div>

      <Tabs>
        <Tab
          label="Details"
          content={
            <div className="scrollable-container">
              <ServiceDetails serviceId={serviceId} />
            </div>
          }
        />
        <Tab
          label="Upload Images"
          content={
            <div className="scrollable-container">
              <Serviceimages />
            </div>
          }
        />
      </Tabs>
    </div>
  );
};

export default Editservice;
