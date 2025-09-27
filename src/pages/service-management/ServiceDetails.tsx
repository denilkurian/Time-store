
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosConfig";
import useCustomToast from "../../hooks/useCustomToast";
import { useLocation } from "react-router-dom";
import { RootState } from "../../redux/store/store";
// import Snackbar from "../../components/Snackbar/Snackbar";
import Button from "../../components/Button/Button";
import { useForm, Controller } from "react-hook-form";
import { VAL_URL, parseValidationRules } from "../../utils/validationRules";


interface ServiceDetailsProps {
  serviceId: number;
  required?: boolean;
  // onSubmit: (formData: any) => void;
}

interface ServiceDetailData {
  title: string;
  category: string;
  subCategory: string;
  excerpt: string;
  description: string;
  mrp: number;
  minimumOrder: string;
  service_unit: string;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = () => {
  const location = useLocation();
  const serviceId = location.state?.serviceId;

  const {
    control,
    // register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ServiceDetailData>();

  const [categories, setCategories] = useState<{ id: number; attributes: { id: number; name: string; parent_id: number | null } }[]>([]);
  const [subCategories, setSubCategories] = useState<{ id: number; attributes: { id: number; name: string; parent_id: number | null } }[]>([]);
  const [serviceUnits, setServiceUnits] = useState<{ id: number; name: string }[]>([]);
  const [validationRules, setValidationRules] = useState<Record<string, { minLength?: number; maxLength?: number }>>({});


  const { showToast } = useCustomToast();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchServiceUnits = async () => {
    try {
      const response = await axiosInstance.get("/service-units");
      if (response.data.success) {
        return response.data.data; // Return the list of service units
      } else {
        console.error("Failed to fetch service units");
        return [];
      }
    } catch (error) {
      console.error("Error fetching service units:", error);
      return [];
    }
  };
  useEffect(() => {
    const loadServiceUnits = async () => {
      const units = await fetchServiceUnits();
      setServiceUnits(units);
    };

    loadServiceUnits();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/service-categories");
      if (response.status === 200) {
        const categoriesData = response.data.data;

        const parents = categoriesData.filter(
          (item: any) => item.attributes.parent_id === null
        );
        const children = categoriesData.filter(
          (item: any) => item.attributes.parent_id !== null
        );

        setCategories(parents);
        setSubCategories(children);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axiosInstance.get(`/services/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch details");
        }

        const attributes = response.data.data.attributes;

        // Set form values dynamically using setValue
        setValue("title", attributes.name || "");
        setValue("category", attributes.category_id?.toString() || "");
        setValue("subCategory", attributes.sub_category_id?.toString() || "");
        setValue("excerpt", attributes.excerpt?.toString() || "");
        setValue("description", attributes.description?.toString() || "");
        setValue("mrp", attributes.mrp || 0);
        setValue("minimumOrder", attributes.minimum_order?.toString() || "");
        setValue("service_unit", attributes.service_unit?.toString() || "");
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchServiceDetails();
  }, [serviceId, token, setValue]);

  const onSubmitForm = async (data: ServiceDetailData) => {
    const updatedData = {
      user_id: userId,
      display_picture: null,
      name: data.title,
      excerpt: data.excerpt,
      description: data.description,
      category_id: parseInt(data.category),
      sub_category_id: parseInt(data.subCategory),
      mrp: Number(data.mrp),
      minimum_order: parseInt(data.minimumOrder),
      service_unit: data.service_unit,
      status: "active",
    };

    try {
      const response = await axiosInstance.patch(`/services/${serviceId}`, updatedData);

      if (response.status === 200) {
        showToast({
          message: "Updated successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error updating service:", error);
      showToast({
        message: "Failed to update the service.",
        type: "error",
      });
    }
  };
  // Fetch validation rules on component mount
  useEffect(() => {
    const fetchValidationRules = async () => {
      try {
        const response = await axiosInstance.get(`${VAL_URL.replace("{type}", "update_service")}`);
        if (response.data?.data) {
          const fieldValidations = response.data.data[0];

          const parsedValidationRules: Record<string, { minLength?: number; maxLength?: number }> = {};

          for (const [field, ruleString] of Object.entries(fieldValidations)) {
            if (typeof ruleString === "string") {
              parsedValidationRules[field] = parseValidationRules(ruleString);
            }
          }

          setValidationRules(parsedValidationRules);
        }
      } catch (error) {
        console.error("Error fetching validation rules:", error);
      }
    };

    fetchValidationRules();
  }, [])


  return (
    <div className="dark:bg-gray-900 dark:text-white text-black px-3 py-4 h-full overflow-scroll overflow-x-hidden">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        {/* Form Fields */}
        <div>
          <label className="block text-sm font-bold">
            Title <span className="text-red-500">*</span>
          </label>
          <Controller
            name="title"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Title is required.",
              },
              ...(validationRules?.name?.minLength && {
                minLength: {
                  value: validationRules.name.minLength,
                  message: `Title must be at least ${validationRules.name.minLength} characters.`,
                },
              }),
              ...(validationRules?.name?.maxLength && {
                maxLength: {
                  value: validationRules.name.maxLength,
                  message: `Title cannot exceed ${validationRules.name.maxLength} characters.`,
                },
              }),
            }}
            render={({ field }) => (
              <input
                {...field}
                id="title"
                placeholder="Enter name"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            )}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold">
            Category <span className="text-red-500 text-[20px]">*</span>
          </label>
          <Controller
            name="category"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Category is required.",
              },
              ...(validationRules?.category?.minLength && {
                minLength: {
                  value: validationRules.category.minLength,
                  message: `Category must be at least ${validationRules.category.minLength} characters.`,
                },
              }),
              ...(validationRules?.category?.maxLength && {
                maxLength: {
                  value: validationRules.category.maxLength,
                  message: `Category cannot exceed ${validationRules.category.maxLength} characters.`,
                },
              }),
            }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.attributes.id}>
                    {category.attributes.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.category && <p className="text-red-500">{errors.category.message}</p>}
        </div>


        <div>
          <label className="block text-sm font-bold">
            Sub Category
          </label>
          <Controller
            name="subCategory"
            control={control}
            rules={{
              // required: {
              //   value: true,
              //   message: "SubCategory is required.",
              // },
              ...(validationRules?.subCategory?.minLength && {
                minLength: {
                  value: validationRules.subCategory.minLength,
                  message: `SubCategory must be at least ${validationRules.subCategory.minLength} characters.`,
                },
              }),
              ...(validationRules?.subCategory?.maxLength && {
                maxLength: {
                  value: validationRules.subCategory.maxLength,
                  message: `SubCategory cannot exceed ${validationRules.subCategory.maxLength} characters.`,
                },
              }),
            }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              >
                <option value="" disabled>
                  Select a subcategory
                </option>
                {subCategories.map((category: any) => (
                  <option key={category.id} value={category.attributes.id}>
                    {category.attributes.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.subCategory && <p className="text-red-500">{errors.subCategory.message}</p>}
        </div>


        <div>
          <label className="block text-sm font-bold">
            Excerpt
          </label>
          <Controller
            name="excerpt"
            control={control}
            rules={{
              // required: {
              //   value: true,
              //   message: "Excerpt is required",
              // },
              ...(validationRules?.excerpt?.minLength && {
                minLength: {
                  value: validationRules.excerpt.minLength,
                  message: `Excerpt must be at least ${validationRules.excerpt.minLength} characters long`,
                },
              }),
              ...(validationRules?.excerpt?.maxLength && {
                maxLength: {
                  value: validationRules.excerpt.maxLength,
                  message: `Excerpt must be at most ${validationRules.excerpt.maxLength} characters`,
                },
              }),
            }}
            render={({ field }) => (
              <textarea
                {...field}
                id="excerpt"
                placeholder="Enter excerpt"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            )}
          />
          {errors.excerpt && <p className="text-red-500">{errors.excerpt.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold">
            Description
          </label>
          <Controller
            name="description"
            control={control}
            rules={{
              // required: {
              //   value: true,
              //   message: "Description is required",
              // },
              ...(validationRules?.description?.minLength && {
                minLength: {
                  value: validationRules.description.minLength,
                  message: `Description must be at least ${validationRules.description.minLength} characters long`,
                },
              }),
              ...(validationRules?.description?.maxLength && {
                maxLength: {
                  value: validationRules.description.maxLength,
                  message: `Description must be at most ${validationRules.description.maxLength} characters`,
                },
              }),
            }}
            render={({ field }) => (
              <textarea
                {...field}
                id="description"
                placeholder="Enter description"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            )}
          />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold">
            MRP <span className="text-red-500">*</span>
          </label>
          <Controller
            name="mrp"
            control={control}
            rules={{
              required: {
                value: true,
                message: "MRP is required.",
              },
              ...(validationRules?.mrp?.minLength !== undefined && {
                min: {
                  value: validationRules.mrp.minLength,
                  message: `MRP must be at least ${validationRules.mrp.minLength}.`,
                },
              }),
              ...(validationRules?.mrp?.maxLength !== undefined && {
                max: {
                  value: validationRules.mrp.maxLength,
                  message: `MRP cannot exceed ${validationRules.mrp.maxLength}.`,
                },
              }),
            }}
            render={({ field }) => (
              <input
                {...field}
                id="mrp"
                type="number"
                placeholder="Enter MRP"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            )}
          />
          {errors.mrp && <p className="text-red-500 text-sm">{errors.mrp.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold">
            Minimum Order <span className="text-red-500">*</span>
          </label>
          <Controller
            name="minimumOrder"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Minimum Order is required.",
              },
              ...(validationRules?.minimum_order?.minLength !== undefined && {
                min: {
                  value: validationRules.minimum_order.minLength,
                  message: `Minimum Order must be at least ${validationRules.minimum_order.minLength}.`,
                },
              }),
              ...(validationRules?.minimum_order?.maxLength !== undefined && {
                max: {
                  value: validationRules.minimum_order.maxLength,
                  message: `Minimum Order cannot exceed ${validationRules.minimum_order.maxLength}.`,
                },
              }),
            }}
            render={({ field }) => (
              <input
                {...field}
                id="minimum_order"
                type="number"
                placeholder="Enter Minimum Order"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            )}
          />
          {errors.minimumOrder && (
            <p className="text-red-500 text-sm">{errors.minimumOrder.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold">
            Service Unit <span className="text-red-500 text-[20px]">*</span>
          </label>
          <Controller
            name="service_unit"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Service Unit is required",
              },
              ...(validationRules?.service_unit?.minLength && {
                minLength: {
                  value: validationRules.service_unit.minLength,
                  message: `Service Unit must be at least ${validationRules.service_unit.minLength}`,
                },
              }),
              ...(validationRules?.service_unit?.maxLength && {
                maxLength: {
                  value: validationRules.service_unit.maxLength,
                  message: `Service Unit cannot exceed ${validationRules.service_unit.maxLength} characters`,
                },
              }),
            }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Service Unit</option>
                {serviceUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            )}
          />

          {errors.service_unit && (
            <p className="text-red-500">{errors.service_unit.message}</p>
          )}
        </div>


        <div className="flex justify-end">
          <Button type="primary" Buttonclass="w-[120px] flex item-center justify-around font-normal">
            Save
          </Button>
        </div>
      </form>

      {/* Snackbar Component */}
      {/* <Snackbar
        message={Snackbar.message}
        open={Snackbar.open}
        onClose={() => { }}
      /> */}
    </div>
  );
};

export default ServiceDetails;