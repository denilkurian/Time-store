import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig";
import { useForm, SubmitHandler } from "react-hook-form";
import { RootState } from "../../redux/store/store";
import {
  setLogoPreview,
  setLoading,
} from "../../redux/reducer/vendorProfileSlice";
import Button from "../../components/Button/Button";
import useCustomToast from "../../hooks/useCustomToast";
import { VAL_URL,parseValidationRules,ValidationRules  } from "../../utils/validationRules";



type ValidationRules = {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  file?: boolean;
  mimes?: string[];
  maxFileSize?: number; // In KB
  maxSize?: number; // Maximum file size in KB (if you need this field specifically)
  allowedTypes?: string[]; // Array of allowed file types (if needed)
};


interface FormValues {
  title: string;
  business_entity: string;
  pan_number: string;
  cin_number: string;
  gst_number: string;
  vendor_unique_id:string;
}
type DetailsTabProps = {
  userStatus: string;
};
const DetailsTab: React.FC<DetailsTabProps> = ({ userStatus }) => {
  const dispatch = useDispatch();
  const { logoPreview } = useSelector(
    (state: RootState) => state.vendorProfile
  );

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const formValues = watch();
  const [businessEntityOptions, setBusinessEntityOptions] = useState<string[]>([]);
  // const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [validationRules, setValidationRules] = useState<Record<string, ValidationRules>>({});


  
  const userId = useSelector((state: RootState) => state.auth.userId);
  const token = useSelector((state: RootState) => state.auth.token);


  const { showToast } = useCustomToast();


  const BASE_URL = "http://127.0.0.1:8000";


  useEffect(() => {
    const fetchLogo = async () => {
      try {
        if (!token) return;
        const response = await axiosInstance.get(`/vendor_logo/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const relativeLogoUrl = response.data.data.attributes.logo_url;
        if (relativeLogoUrl) {
          dispatch(setLogoPreview(`${BASE_URL}${relativeLogoUrl}`));
        } else {
          dispatch(setLogoPreview("/assets/images/static-logo.png"));
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
        console.log(title)
      }
    };


    fetchLogo();
  }, [dispatch, token, userId]);

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "upload" | "update"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      type === "upload" ? handleLogoUpload(file) : handleLogoUpdate(file);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!token) return;
  
    // Ensure validation rules are available
    const validation = validationRules["vendor_logo"];
    if (!validation) {
      showToast({
        message: "Validation rules not available. Please try again later.",
        type: "error",
      });
      return;
    }
  
    // Validate file size
    if (validation.maxSize && file.size > validation.maxSize * 1024) {
      showToast({
        message: `File size exceeds the maximum limit of ${validation.maxSize}KB.`,
        type: "error",
      });
      return;
    }
  
    // Validate file type
    const allowedTypes = validation.allowedTypes || [];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension && !allowedTypes.includes(fileExtension)) {
      showToast({
        message: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
        type: "error",
      });
      return;
    }
  
    try {
      dispatch(setLoading(false));
      const formData = new FormData();
      formData.append("data[attributes][vendor_logo]", file);
      formData.append("user_id", String(userId));
  
      const response = await axiosInstance.post(`/vendor_logo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const relativeLogoUrl = response.data.data.attributes.logo_url;
      dispatch(setLogoPreview(`${BASE_URL}${relativeLogoUrl}`));
      showToast({
        message: "Logo uploaded successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      showToast({
        message: "Failed to upload. Please try again.",
        type: "error",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  const handleLogoUpdate = async (file: File) => {
    if (!token) return;
    try {
      dispatch(setLoading(false));
      const formData = new FormData();
      formData.append("data[attributes][vendor_logo]", file);

      const response = await axiosInstance.post(
        `/vendor_logo_update/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const relativeLogoUrl = response.data.data.attributes.logo_url;
      dispatch(setLogoPreview(`${BASE_URL}${relativeLogoUrl}`));
      showToast({
        message: "Logo updated",
        type: 'success',
      });

    } catch (error) {
      console.error("Error updating logo:", error);
      showToast({
        message: "Failed to upload. Please try again.",
        type: 'error',
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteLogo = async () => {
    if (!token) return;
    try {
      dispatch(setLoading(false));
      await axiosInstance.delete(`/vendor_logo/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setLogoPreview("/assets/images/static-logo.png"));
      showToast({
        message: "logo deleted",
        type: 'success',
      });

    } catch (error) {
      console.error("Error deleting logo:", error);
      showToast({
        message: "Failed to delete. Please try again.",
        type: 'error',
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchFirstName = async (userId: string, token: string) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`, {

        headers: { Authorization: `Bearer ${token}` },
      });
      const firstName = response.data.data.attributes.first_name;
      console.log("name", firstName);
      return firstName;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchBusinessEntities = async () => {
      try {
        const response = await axiosInstance.get("/enums/business-entity", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const businessEntities = response.data.data.attributes;
        setBusinessEntityOptions(businessEntities);


        if (businessEntities === "individual") {
          const firstName = await fetchFirstName(userId!, token!);
          if (firstName) {
            setValue("title", firstName);
            setIsReadOnly(true);
            setIsDisabled(true);
            showToast({
              message: "Title as Username in a Individual Business",
              type: 'success',
            });
      
          } else {
            setIsReadOnly(false);
            setIsDisabled(false);
          }
        }
      } catch (error) {
        console.error("Error fetching business entities:", error);
      }
    };

    const fetchVendorProfile = async () => {
      try {
        const response = await axiosInstance.get(`/vendor_profiles/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { title, business_entity, pan_no, cin, gst_no , vendor_unique_id } = response.data.data.attributes;
        setValue("title", title);
        setValue("business_entity", business_entity);
        setValue("pan_number", pan_no);
        setValue("cin_number", cin);
        setValue("gst_number", gst_no);
        setValue("vendor_unique_id",vendor_unique_id);

    //       // Store vendor_unique_id in the state
    // setVendorUniqueId(vendor_unique_id);

      } catch (error) {
        console.error("Error fetching vendor profile:", error);
      }
    };


    fetchBusinessEntities();
    fetchVendorProfile();
  }, [setValue, token, userId]);


  useEffect(() => {
    const fetchDetails = async () => {
      if (formValues.business_entity === "individual") {
        if (userId && token) {
          const firstName = await fetchFirstName(userId, token);
          if (firstName) {
            setValue("title", firstName);
            setIsReadOnly(true);
          } else {
            setIsReadOnly(false);
          }
        }
      } else {
        setIsReadOnly(false);
      }
    }
    fetchDetails();
  }, [formValues.business_entity]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (userStatus === "active" || userStatus === "unverified" || userStatus === "revision") {
      try {
        if (userStatus === "active") {
          await axiosInstance.post(
            `/users/${userId}/status/revision`,
            {}, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
  
        await axiosInstance.patch(
          `/vendor_profiles/${userId}`,
          {
            data: {
              attributes: {
                title: data.title,
                business_entity: data.business_entity,
                pan_no: data.pan_number,
                cin: data.cin_number,
                gst_no: data.gst_number,
              },
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        showToast({
          message: "Profile updated successfully.",
          type: "success",
        });
      } catch (error) {
        console.error("Error updating vendor profile:", error);
        showToast({
          message: "Failed to update. Please try again.",
          type: "error",
        });
      }
    } else if (
      userStatus === "pending_approval" ||
      userStatus === "pending_change_approval" ||
      userStatus === "blocked"
    ) {
      showToast({
        message: "Update not allowed. Please contact Admin.",
        type: "error",
      });
    } else {
      showToast({
        message: "Unexpected status. Please contact Admin.",
        type: "error",
      });
    }
  };

  // Fetch validation rules on component mount
useEffect(() => {
  const fetchValidationRules = async () => {
    try {
      const response = await axiosInstance.get(`${VAL_URL.replace("{type}", "create_vendor_logo")}`);
      if (response.data?.data) {
        const fieldValidations = response.data.data[0];

        const parsedValidationRules: Record<string, ValidationRules> = {};

        for (const [field, ruleString] of Object.entries(fieldValidations)) {
          if (Array.isArray(ruleString)) {
            const ruleStringJoined = ruleString.join("|"); // Join array into a single string
            parsedValidationRules[field] = parseValidationRules(ruleStringJoined);
          }
        }

        setValidationRules(parsedValidationRules);
      }
    } catch (error) {
      console.error("Error fetching validation rules:", error);
    }
  };

  fetchValidationRules();
}, []);

    
  return (
<div className="w-full p-4 md:p-8">
  <div className="mb-4">
    <div className="relative w-40 h-40 mx-auto">
      <div className="relative w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center">
        <img
          src={logoPreview as string}
          className="w-28 h-28 object-cover rounded-full"
        />
        {logoPreview && logoPreview !== "/assets/images/static-logo.png" && (
          <button
            type="button"
            className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-400"
            onClick={handleDeleteLogo}
          >
            <FaTrash />
          </button>
        )}
        <div className="absolute bottom-2 right-2 p-1 text-blue-600 hover:text-blue-500">
          <label htmlFor="logoUpload" className="cursor-pointer">
            <FaEdit />
          </label>
          <input
            type="file"
            id="logoUpload"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, "update")}
          />
        </div>
      </div>
    </div>
  </div>

  <form className="relative" onSubmit={handleSubmit(onSubmit)}>
    <div className="grid grid-cols-1 gap-4">
      {/* Business Entity */}
      <div>
        <label
          htmlFor="business_entity"
          className="block text-gray-700 dark:text-gray-300 mb-1"
        >
          Business Entity
          <span className="text-red-500 text-[20px]">*</span>
        </label>
        <select
          id="business_entity"
          {...register("business_entity", { required: "Business entity is required" })}
          className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 ${
            errors.business_entity ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select Business Entity</option>
          {businessEntityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.business_entity && (
          <p className="text-red-500 text-sm">{errors.business_entity.message}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 mb-1">
          Title
          <span className="text-red-500 text-[20px]">*</span>
        </label>
        <input
          type="text"
          id="title"
          readOnly={isReadOnly}
          disabled={isDisabled}
          {...register("title", {
            required: "Title is required",
            onChange: (e) => setTitle(e.target.value),
          })}
          className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 ${
            errors.title ? "border-red-500" : "border-gray-300"
          } ${isReadOnly || isDisabled ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed" : "bg-white dark:bg-gray-800"}`}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* PAN Number */}
      <div>
        <label
          htmlFor="pan_number"
          className="block text-gray-700 dark:text-gray-300 mb-1"
        >
          PAN Number
        </label>
        <input
          type="text"
          id="pan_number"
          {...register("pan_number", {
            pattern: {
              value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
              message: "Invalid PAN format",
            },
          })}
          className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 ${
            errors.pan_number ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.pan_number && (
          <p className="text-red-500 text-sm">{errors.pan_number.message}</p>
        )}
      </div>

      {/* CIN Number */}
      <div>
        <label
          htmlFor="cin_number"
          className="block text-gray-700 dark:text-gray-300 mb-1"
        >
          CIN Number
        </label>
        <input
          type="text"
          id="cin_number"
          {...register("cin_number", {
            pattern: {
              value: /^[A-Z]{1}[0-9]{4}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
              message: "Invalid CIN format",
            },
          })}
          className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 ${
            errors.cin_number ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.cin_number && (
          <p className="text-red-500 text-sm">{errors.cin_number.message}</p>
        )}
      </div>

      {/* GST Number */}
      <div>
        <label
          htmlFor="gst_number"
          className="block text-gray-700 dark:text-gray-300 mb-1"
        >
          GST Number
        </label>
        <input
          type="text"
          id="gst_number"
          {...register("gst_number", {
            pattern: {
              value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/,
              message: "Invalid GST format",
            },
          })}
          className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 ${
            errors.gst_number ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.gst_number && (
          <p className="text-red-500 text-sm">{errors.gst_number.message}</p>
        )}
      </div>
    </div>

    {/* Submit Button */}
    <div className="mt-6 flex justify-end">
      <Button
        type="primary"
        Buttonclass="py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg w-[120px] hover:bg-blue-700 dark:hover:bg-blue-600"
        // disabled={isLoading}
      >
        Update
      </Button>
    </div>
  </form>
</div>

  );
};

export default DetailsTab;