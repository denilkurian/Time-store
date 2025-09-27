import React from "react";

type props = {
    isViewModalOpen: boolean;
    handleCloseViewModal: () => void;
    data: {
        enquirer_name:string;
        email:string;
        product_name:string;
        phone:string;
        message:string;
        read:number;
        
    }
};



export const EnquiryView: React.FC<props> = ({ isViewModalOpen, handleCloseViewModal, data }) => {


    return (
        <>
            {isViewModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
                    <div className="bg-lightmode dark:bg-gray-900 p-6 rounded-lg w-full max-w-4xl relative">
                        {/* Header */}
                        <div className="flex justify-between items-center dark:border-b-gray-800 border-b pb-4 dark:text-white">

                            <h2 className="text-2xl font-semibold dark:text-white">Enquiry Details</h2>

                            <button
                                onClick={handleCloseViewModal}
                                className="text-gray-700 dark:text-white dark:hover:text-gray-300 text-xl hover:text-red-500"
                                aria-label="Close Modal"
                            >
                                X
                            </button>


                        </div>
                        <div className="bg-lightmode dark:bg-gray-900 m-2 p-10 rounded-lg min-h-[60vh] max-w-[60vw] overflow-auto">
                            <h2 className="text-lg font-bold mb-6 dark:text-white">
                                Enquiry Details
                            </h2>
                            <div className="grid grid-cols-2 gap-8 max-h-[50vh]">

                                <div>
                                    <p className="text-xs font-medium text-gray-500">Enquirer Name</p>
                                    <p className="text-sm dark:text-white text-gray-800 mt-1">{data.enquirer_name || 'N/A'}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-500">Email</p>
                                    <p className="text-sm dark:text-white text-gray-800 mt-1">{data.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Product/Service</p>
                                    <p className="text-sm dark:text-white text-gray-800 mt-1">{data.product_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Phone</p>
                                    <p className="text-sm dark:text-white text-gray-800 mt-1">{data.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Message</p>
                                    <p className="text-sm dark:text-white text-gray-800 mt-1">{data.message || 'N/A'}</p>
                                </div>
                                {data.read===1 ? 
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Status</p>
                                    <p className="text-sm dark:text-white  mt-1 text-green-400">Viewed</p>
                                </div>: ''}
                                {/* <div>
                                    <p className="text-xs font-medium text-gray-500">Date</p>
                                    <p className="text-sm dark:text-white text-gray-800 mt-1">{data.date || 'N/A'}</p>
                                </div> */}

                            </div>
                        </div> </div> </div>
            )}

        </>
    )


}