import React from "react";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "../../utils/axiosConfig";
import useCustomToast from "../../hooks/useCustomToast";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";


interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: { title: string; id: string }) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const {handleSubmit, formState: { errors }, reset, control } = useForm({
        defaultValues: { productName: "" },
    });
    const { showToast } = useCustomToast();
    const navigate = useNavigate();

    const onSubmitHandler = async (data: { productName: string }) => {
        try {
            const { productName } = data;

            // API request to create a product
            const response = await axiosInstance.post("/products", {
                name: productName,
            });

            if (response.data.status === "success") {
                const createdProduct = {
                    title: response.data.data.attributes.name,
                    id: response.data.data.id,
                };
                showToast({ message: "Product Added", duration: 3000, type: "success" });
                navigate(`/edit-product/${createdProduct.id}`, { state: { productId: createdProduct.id } });
                onSubmit(createdProduct);
                reset(); // Reset the form after submission
                onClose();
            } else {
                showToast({ message: `${response.data.message} !`, type: "error" });
            }
        } catch (err) {
            console.error("Error creating product:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-lightmode dark:bg-gray-900 rounded-lg p-6 w-1/3">
                <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="mb-4">
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        <Controller
                            name="productName"
                            control={control}
                            rules={{
                                required: "Product name is required.",
                                minLength: {
                                    value: 3,
                                    message: "Product name must be at least 3 characters .",
                                },
                                maxLength: {
                                    value: 255,
                                    message: "Product name must not exceed 255 characters.",
                                },
                            }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    id="productName"
                                    className="dark:bg-gray-800 mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter product name"
                                />
                            )}
                        />
                        {errors.productName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.productName.message}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button type="transparent" onClick={()=>{
                            reset()
                            onClose()
                        }} >
                            Cancel
                        </Button>
                        <Button type="primary">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
