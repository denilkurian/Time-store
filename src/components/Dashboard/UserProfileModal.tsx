
import React, { useRef, useEffect, useState } from 'react';
import { Dialog } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import useLogout from "../../utils/Logout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useGetUserByIdQuery } from '../../redux/features/users/userApi';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import { Skeleton } from '@mui/material';
import axiosInstance from "../../utils/axiosConfig";

type Props = {
    action?: string | null | undefined;
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    className?: string;
};

const UserProfileModal: React.FC<Props> = ({ open, onClose }) => {
    // const dispatch = useDispatch<AppDispatch>();
    const logoutUser = useLogout();
    const { userType, userId } = useSelector((state: RootState) => state.auth);
    const [vendorUniqueId, setVendorUniqueId] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const { data, isFetching } = useGetUserByIdQuery({ userId: Number(userId) });

    const handleLogout = () => {
        logoutUser();
        onClose();
    };

    const handleOutsideClick = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        if (open) {
            document.addEventListener("mousedown", handleOutsideClick);
            // Fetch vendor profile data
            axiosInstance
                .get(`/vendor_profiles/${userId}`)
                .then((response) => {
                    const uniqueId = response.data.data.attributes.vendor_unique_id;
                    setVendorUniqueId(uniqueId);
                })
                .catch((error) => {
                    console.error("Error fetching vendor profile:", error);
                });
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [open, userId]);

    return (
        <Dialog
            open={open}
            handler={onClose}
            className="fixed inset-0 flex items-start justify-end bg-black bg-opacity-50 z-50 rounded-none"
            animate={{
                mount: undefined,
                unmount: undefined,
            }}
            {...{} as any}
        >
            <div ref={modalRef} className="absolute top-14 right-2 w-[259px]">
                <div
                    className={`bg-white p-[6px] dark:bg-gray-900 h-[390px] rounded-lg shadow-lg flex flex-col justify-center space-y-[10px] transform ${open ? 'animate-slide-in-right' : 'animate-slide-out-right'
                        }`}
                >
                    <div className="h-[101px] bg-[#514E6D] dark:bg-gray-800 rounded-[10px] flex items-center justify-center p-4">
                        <Avatar sx={{ bgcolor: deepOrange[500] }}>
                            {data?.data.attributes.first_name.split('')[0]}
                        </Avatar>
                    </div>

                    <div className="flex flex-col items-center dark:text-white -space-y-[3px]">
                        {isFetching ? (
                            <Skeleton sx={{ height: 20, width: '50%', mb: 1 }} animation="pulse" variant="rectangular" />
                        ) : (
                            <>
                                <h3 className="font-bold">{data?.data.attributes.first_name}</h3>
                                <span>{data?.data.attributes.email}</span>
                            </>
                        )}
                        {vendorUniqueId && (
                            <span className="text-gray-500 dark:text-gray-300">Vendor ID:{vendorUniqueId}</span>
                        )}
                    </div>

                    <div className="flex items-start justify-between flex-grow flex-col overflow-auto ps-[2px] gap-1 dark:text-white">
                        <Link to="/user-account" className="w-full dark:hover:text-gray-600" onClick={onClose}>
                            <h1 className="font-medium text-sm hover:bg-gray-200 w-full rounded-md ps-2 py-[7px] transition-all ease-in-out cursor-pointer">
                                Account
                            </h1>
                        </Link>
                        {userType === "vendor" && (
                            <>
                                <Link to="/vendor-profile" className="w-full dark:hover:text-gray-600" onClick={onClose}>
                                    <h1 className="font-medium text-sm hover:bg-gray-200 w-full rounded-md ps-2 py-[7px] transition-all ease-in-out cursor-pointer">
                                        Profile
                                    </h1>
                                </Link>
                                <Link to="/product-management" className="w-full dark:hover:text-gray-600" onClick={() => onClose()}>
                                    <h1 className="font-medium text-sm hover:bg-gray-200 w-full rounded-md ps-2 py-[7px] transition-all ease-in-out cursor-pointer">
                                        Products
                                    </h1>
                                </Link>
                                <Link to="/service-management" className="w-full dark:hover:text-gray-600" onClick={() => onClose()}>
                                    <h1 className="font-medium text-sm hover:bg-gray-200 w-full rounded-md ps-2 py-[7px] transition-all ease-in-out cursor-pointer">
                                        Services
                                    </h1>
                                </Link>
                            </>
                        )}
                        <button
                            className="w-full bg-[#7A5BF5] hover:bg-[#6d49d6] text-white py-[5px] px-6 rounded-lg transition-all"
                            onClick={handleLogout}
                        >
                            <p className="text-sm">Logout</p>
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default UserProfileModal;
