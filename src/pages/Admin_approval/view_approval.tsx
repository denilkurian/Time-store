import React, { useState, useEffect } from "react";

// Import your individual tabs
import DetailsTab from "./details";
import DocumentsTab from "./documents";
import UploadImagesTab from "./upload_image";
import AddressTab from "./address";

type Props = {
  isModalOpen: boolean;
  closeModal: () => void;
  viewData: any;
};

const ViewApproval: React.FC<Props> = ({ isModalOpen, closeModal, viewData }) => {
  const [activeTab, setActiveTab] = useState("details"); // To switch between tabs

  // Reset to "details" tab when the modal is opened
  useEffect(() => {
    if (isModalOpen) {
      setActiveTab("details");
    }
  }, [isModalOpen]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "details":
        return <DetailsTab viewData={viewData} />;
      case "documents":
        return <DocumentsTab viewData={viewData} />;
      case "address":
        return <AddressTab viewData={viewData} />;
      case "images":
        return <UploadImagesTab viewData={viewData} />;
      default:
        return <DetailsTab viewData={viewData} />;
    }
  };

  return (
    <>
      {/* Modal Structure */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-lightmode dark:bg-gray-900 p-6 rounded-lg w-full max-w-4xl relative">
            {/* Header */}
            <div className="flex justify-between items-center dark:border-b-gray-800 border-b pb-4 dark:text-white">
              {viewData.type === "Product" ? (
                <h2 className="text-2xl font-semibold dark:text-white">Product Information</h2>
              ) : viewData.type === "Service" ? (
                <h2 className="text-2xl font-semibold dark:text-white">Service Information</h2>
              ) : viewData.type === "User" ? (
                <h2 className="text-2xl font-semibold dark:text-white">Vendor Information</h2>
              ) : (
                <h2 className="text-2xl font-semibold dark:text-white">General Information</h2>
              )}
              <button
                onClick={closeModal}
                className="text-gray-700 dark:text-white dark:hover:text-gray-300 text-xl hover:text-red-500"
                aria-label="Close Modal"
              >
                X
              </button>
            </div>

            {/* Tab Navigation */}
            <ul className="mt-4 flex dark:border-b-gray-800 border-b dark:text-white">
              {[
                { key: "details", label: "Details" },
                ...(viewData.type === "Product" || viewData.type === "Service" 
                  ? [{ key: "images", label: "Images" }]
                  : [
                    { key: "address", label: "Address" },
                    { key: "documents", label: "Documents" }
                  ]),
              ].map((tab) => (
                <li
                  key={tab.key}
                  className={`cursor-pointer dark:text-white py-2 px-4 transition-all ${activeTab === tab.key
                      ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                      : "text-gray-600 hover:text-blue-500"
                    }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </li>
              ))}
            </ul>

            {/* Content */}
            <div className="mt-6">{renderActiveTab()}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewApproval;
