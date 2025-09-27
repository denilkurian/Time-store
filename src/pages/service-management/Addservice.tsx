import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import useCustomToast from "../../hooks/useCustomToast";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../../components/Button/Button";

interface AddServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: { title: string; id: number }) => void;
    userId?: number; // Add the userId prop
}

interface ServiceFormData {
    serviceName: string;
}

const AddService: React.FC<AddServiceModalProps> = ({ isOpen, onClose, onSubmit, userId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useCustomToast();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<ServiceFormData>();
    const [userStatus, setUserStatus] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(`/users/${userId}`);
                const status = response.data?.data?.attributes?.status;
                setUserStatus(status);
            } catch (err) {
                console.error("Error fetching user data:", err);
                showToast({ message: "Failed to fetch user data", type: "error", duration: 3000 });
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId, showToast]);

    const handleAddService = async (data: ServiceFormData) => {
        if (userStatus !== "active") {
            showToast({ message: "You are not active, Please Contact Admin", type: "error", duration: 3000 });
            return;
        }

        try {
            setIsLoading(true);

            const response = await axiosInstance.post("/services", {
                name: data.serviceName,
            });

            if (response.data.status === "success") {
                const createdService = {
                    title: response.data.data.attributes.name,
                    id: response.data.data.id,
                };
                onSubmit(createdService);
                showToast({ message: "Service added successfully!", duration: 3000, type: "success" });
                navigate(`/edit-service/${createdService.id}`, { state: { serviceId: createdService.id } });
                onClose();
            } else {
                showToast({ message: "Failed to create the service. Please try again.", type: "error", duration: 3000 });
            }
        } catch (err) {
            console.error("Error creating service:", err);
            showToast({ message: "An error occurred while creating the service.", type: "error", duration: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-lightmode dark:bg-gray-900 rounded-lg p-6 w-1/3">
                <h2 className="text-2xl font-semibold mb-4">Add New Service</h2>
                <form onSubmit={handleSubmit(handleAddService)}>
                    <div className="mb-4">
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                            Service Name
                        </label>
                        <input
                            type="text"
                            id="productName"
                            className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                            placeholder="Enter service name"
                            {...register("serviceName", {
                                required: "Service Field is required",
                                minLength: {
                                    value: 3,
                                    message: "Service must be 3 characters",
                                },
                            })}
                        />
                    </div>
                    {errors.serviceName && <p className="text-red-500 text-sm mb-2">{errors.serviceName.message}</p>}
                    <div className="flex justify-end space-x-3">
                        <Button
                            onClick={onClose}
                            type="transparent"
                            disabled={isLoading}
                        >Cancel</Button>

                        <Button type="primary" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddService;
