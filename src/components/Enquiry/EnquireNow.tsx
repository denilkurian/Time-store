import React from 'react';
// import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useState } from "react";
// import { useNavigate } from 'react-router-dom';

// import ToasterMessage from '../../components/message/Toaster';
import ModalComponent from "./../Modal/ModalCommon";
import EnquiryForm from './EnquiryForm';
import Button from "../Button/Button";
// const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

type Props = {
    enquirable: any
}

const EnquireNowButton: React.FC<Props> = ({
    enquirable
}) => {

    // const baseUrl = import.meta.env.VITE_BASE_URL

    const [isModalOpen, setIsModalOpen] = useState(false);    
    return (
        <div>

            <Button
                Buttonclass="p-0 w-full rounded-lg" type="warning"
                onClick={() => setIsModalOpen(true)}
            >
                Enquire
            </Button>

            <div className="">
                <ModalComponent
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Enquiry Form"
                    footer=""
                >
                    <div className='flex items-center justify-between'>
                        {enquirable.image && <div className="flex justify-center">
                            <img
                                src={`${enquirable.image}`}
                                alt={enquirable.name}
                                className="w-32 h-32 object-cover"
                            />
                        </div>}

                        <h4 className="my-3 text-lg font-semibold text-gray-600 dark:text-gray-200 text-center">
                            {enquirable.type} : {enquirable.name}
                        </h4>
                        <hr className="my-2" />
                    </div>

                    {/* Enquiry Form */}
                    <EnquiryForm setIsModalOpen={setIsModalOpen} enquirable={enquirable} />
                </ModalComponent>
            </div>

        </div>
    );
}

export default EnquireNowButton;