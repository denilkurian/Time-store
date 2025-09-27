import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosConfig";
import useCustomToast from "../../hooks/useCustomToast";
import { useLocation } from "react-router-dom";
import { RootState } from "../../redux/store/store";
import Snackbar from "../../components/Snackbar/Snackbar";
import Button from "../../components/Button/Button";
import { useForm, Controller } from "react-hook-form";
import { VAL_URL,parseValidationRules } from "../../utils/validationRules";

interface DetailsProps {
  productId: string;
}

const Details: React.FC<DetailsProps> = ({  }) => {
  const location = useLocation();
  const productId = location.state?.productId;

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [message] = useState("");
  const { showToast } = useCustomToast();
  const [validationRules, setValidationRules] = useState<Record<string, { minLength?: number; maxLength?: number }>>({});
  const userId = useSelector((state: RootState) => state.auth.userId);
  const token = useSelector((state: RootState) => state.auth.token);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      subCategory: "",
      excerpt: "",
      description: "",
      mrp: "",
      minimumOrder: "",
    },
  });

  const categoryValue = watch("category");

  const onSubmitForm = async (data: any) => {
    const updatedData = {
      user_id: userId,
      display_picture: null,
      name: data.title,
      excerpt: data.excerpt,
      description: data.description,
      category_id: parseInt(data.category),
      sub_category_id: parseInt(data.subCategory),
      mrp: parseInt(data.mrp),
      minimum_order: parseInt(data.minimumOrder),
      status: "active",
    };

    try {
      const response = await axiosInstance.patch(`/products/${productId}`, updatedData);

      if (response.status === 200) {
        showToast({
          message: "Product updated successfully.",
          type: "success",
        });
      }
    } catch (error: any) {
      showToast({
        message: error.response?.data?.message || "Failed to update the product.",
        type: "error",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/product-categories");
      if (response.status === 200) {
        const categoriesData = response.data.data;
        setCategories(categoriesData.filter((item: any) => item.attributes.parent_id === null));
        setSubCategories(categoriesData.filter((item: any) => item.attributes.parent_id !== null));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();

    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const attributes = response.data.data.attributes;
          setValue("title", attributes.name || "");
          setValue("category", attributes.category_id?.toString() || "");
          setValue("subCategory", attributes.sub_category_id?.toString() || "");
          setValue("excerpt", attributes.excerpt || "");
          setValue("description", attributes.description || "");
          setValue("mrp", attributes.mrp?.toString() || "");
          setValue("minimumOrder", attributes.minimum_order?.toString() || "");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId, token, setValue]);

  const handleSnackbarClose = () => {
    setOpen(false);
  };

   // Fetch validation rules on component mount
  useEffect(() => {
    const fetchValidationRules = async () => {
      try {
        const response = await axiosInstance.get(`${VAL_URL.replace("{type}", "update_product")}`);
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
    <div className="dark:bg-gray-900 dark:text-white bg-white text-black px-3 py-4 h-full overflow-scroll overflow-x-hidden">
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
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
          Category <span className="text-red-500">*</span>
        </label>
        <Controller
          name="category"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Category is required.",
            },
          }}
          render={({ field }) => (
            <select
              {...field}
              id="category"
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold">Sub Category</label>
        <select
          {...register("subCategory")}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select a subcategory
          </option>
          {subCategories
            .filter((sub: any) => sub.attributes.parent_id === parseInt(categoryValue))
            .map((sub: any) => (
              <option key={sub.id} value={sub.attributes.id}>
                {sub.attributes.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold">Excerpt</label>
        <Controller
          name="excerpt"
          control={control}
          rules={{
            ...(validationRules?.excerpt?.minLength && {
              minLength: {
                value: validationRules.excerpt.minLength,
                message: `Excerpt must be at least ${validationRules.excerpt.minLength} characters.`,
              },
            }),
            ...(validationRules?.excerpt?.maxLength && {
              maxLength: {
                value: validationRules.excerpt.maxLength,
                message: `Excerpt cannot exceed ${validationRules.excerpt.maxLength} characters.`,
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
        {errors.excerpt && <p className="text-red-500 text-sm">{errors.excerpt.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold">Description</label>
        <Controller
          name="description"
          control={control}
          rules={{
            ...(validationRules?.description?.minLength && {
              minLength: {
                value: validationRules.description.minLength,
                message: `Description must be at least ${validationRules.description.minLength} characters.`,
              },
            }),
            ...(validationRules?.description?.maxLength && {
              maxLength: {
                value: validationRules.description.maxLength,
                message: `Description cannot exceed ${validationRules.description.maxLength} characters.`,
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
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
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

        <div className="flex justify-end">
          <Button
            type="primary"
          >
            Save
          </Button>
        </div>
      </form>

      <Snackbar
        message={message}
        open={open}
        onClose={handleSnackbarClose}
        autoHideDuration={6000}
      />
    </div>
  );
};

export default Details;
