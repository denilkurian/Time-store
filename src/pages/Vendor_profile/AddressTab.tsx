import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosConfig";
import { RootState } from "../../redux/store/store";
import useCustomToast from "../../hooks/useCustomToast";
import Button from "../../components/Button/Button";

type AddressTabProps = {
  userStatus: string;
};
const AddressTab: React.FC <AddressTabProps> = ({ userStatus }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  // const [loadingStates, setLoadingStates] = useState(false);
  // const [loadingCities, setLoadingCities] = useState(false);
  const [vendorAddressId, setVendorAddressId] = useState<number | null>(null);

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const userId = useSelector((state: RootState) => state.auth.userId);
  const token = useSelector((state: RootState) => state.auth.token);
  const { showToast } = useCustomToast();

  useEffect(() => {
    const fetchData = async () => {
      console.log("id",userId);
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/vendor_address/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { id } = response.data.data;
        setVendorAddressId(id);

        const { attributes } = response.data.data;
        const { street_address, postal_code, city_id, state_id, country_id } = attributes;

        setValue("address", street_address);
        setValue("postal", postal_code);
        setValue("city", city_id);
        setValue("state", state_id);
        setValue("country", country_id);
      } catch (error) {
        console.error("Error fetching address:", error);
        showToast({
          message: "Please try again ",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    const fetchCountries = async () => {
      try {
        const countryResponse = await axiosInstance.get("/countries");
        setCountries(countryResponse.data.data);
    
        // Automatically set "India" as the default country if it exists
        const india = countryResponse.data.data.find((country: any) => country.name === "India");
    
        if (india) {
          setValue("country", india.id);
          // Optionally, set only India as the selectable option
          setCountries([india]); // This will ensure only India is shown in the selection.
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
        fetchData();
    fetchCountries();
  }, [userId, setValue]);

  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry) return;

      try {
        // setLoadingStates(true);
        const stateResponse = await axiosInstance.get(`/states?country=${selectedCountry}`);
        setStates(stateResponse.data.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        // setLoadingStates(false);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState) return;

      try {
        // setLoadingCities(true);
        const cityResponse = await axiosInstance.get(`/cities?state=${selectedState}`);
        setCities(cityResponse.data.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        // setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedState]);



const onSubmit = async (data: any) => {
  if (userStatus === "pending_approval") {
    showToast({ message: "Please contact Admin", type: "error" });
    return;
  }

  try {
    setIsLoading(true);

    // If user status is active, change status to revision
    if (userStatus === "active") {
      await axiosInstance.post(
        `/users/${userId}/status/revision`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    const response = await axiosInstance.patch(
      `/vendor_address/${vendorAddressId}`,
      {
        data: {
          attributes: {
            street_address: data.address,
            postal_code: data.postal,
            city_id: data.city,
            state_id: data.state,
            country_id: data.country,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    showToast({
      message: "Updated Successfully",
      type: "success",
    });

    const { attributes } = response.data.data;
    setValue("address", attributes.street_address);
    setValue("postal", attributes.postal_code);
    setValue("city", attributes.city_id);
    setValue("state", attributes.state_id);
    setValue("country", attributes.country_id);
  } catch (error) {
    console.error("Error updating address:", error);
    showToast({
      message: "Failed to update",
      type: "error",
    });
  } finally {
    setIsLoading(false);
  }
};


  const handlePostalInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/[^0-9]/g, "");
  };

  return (
    <>
      <form
  onSubmit={handleSubmit(onSubmit)}
  className="w-full p-4 md:p-8 rounded-lg flex flex-col space-y-6 bg-white dark:bg-gray-800 shadow-md"
>
  {/* Address Field */}
  <div>
    <label
      htmlFor="address"
      className="block text-gray-700 dark:text-gray-300 font-medium"
    >
      Street Address<span className="text-red-500 text-[20px]">*</span>
    </label>
    <textarea
      id="address"
      placeholder="Enter your address"
      {...register("address", { required: "Address is required" })}
      className={`w-full p-3 border ${
        errors.address
          ? "border-red-500"
          : "border-gray-300 dark:border-gray-600"
      } rounded-lg resize-y bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
    />
    {errors.address && errors.address.message && (
      <span className="text-red-500 text-sm">
        {String(errors.address.message)}
      </span>
    )}
  </div>

  {/* Postal Code Field */}
  <div>
    <label
      htmlFor="postal"
      className="block text-gray-700 dark:text-gray-300 font-medium"
    >
      Postal Code<span className="text-red-500 text-[20px]">*</span>
    </label>
    <input
      id="postal"
      type="text"
      placeholder="Enter postal code"
      maxLength={6}
      onInput={handlePostalInput}
      {...register("postal", {
        required: "Postal code is required",
        pattern: {
          value: /^[0-9]{6}$/,
          message: "Postal code must be 6 digits",
        },
      })}
      className={`w-full p-3 border ${
        errors.postal
          ? "border-red-500"
          : "border-gray-300 dark:border-gray-600"
      } rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
    />
    {errors.postal && errors.postal.message && (
      <span className="text-red-500 text-sm">
        {String(errors.postal.message)}
      </span>
    )}
  </div>

  {/* Country Field */}
  <div  className="relative">
    <label
      htmlFor="country"
      className="block text-gray-700 dark:text-gray-300 font-medium"
    >
      Country<span className="text-red-500 text-[20px]">*</span>
    </label>
    <select
      id="country"
      {...register("country", { required: "Country is required" })}
      className={`w-full p-3 border ${
        errors.country
          ? "border-red-500"
          : "border-gray-300 dark:border-gray-600"
      } rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
    >
      <option value="">Select Country</option>
      {countries.map((country: any) => (
        <option key={country.id} value={country.id}>
          {country.name}
        </option>
      ))}
    </select>
    {errors.country && errors.country.message && (
      <span className="text-red-500 text-sm">
        {String(errors.country.message)}
      </span>
    )}
  </div>

  {/* State Field */}
  <div >
    <label
      htmlFor="state"
      className="block text-gray-700 dark:text-gray-300 font-medium"
    >
      State<span className="text-red-500 text-[20px]">*</span>
    </label>
    <select
      id="state"
      {...register("state", { required: "State is required" })}
      className={`w-full p-3 border ${
        errors.state
          ? "border-red-500"
          : "border-gray-300 dark:border-gray-600"
      } rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
    >
      <option value="">Select State</option>
      {states.map((state: any) => (
        <option key={state.id} value={state.id}>
          {state.name}
        </option>
      ))}
    </select>
    {errors.state && errors.state.message && (
      <span className="text-red-500 text-sm">
        {String(errors.state.message)}
      </span>
    )}
  </div>

  {/* City Field */}
  <div>
    <label
      htmlFor="city"
      className="block text-gray-700 dark:text-gray-300 font-medium"
    >
      City<span className="text-red-500 text-[20px]">*</span>
    </label>
    <select
      id="city"
      {...register("city", { required: "City is required" })}
      className={`w-full p-3 border ${
        errors.city
          ? "border-red-500"
          : "border-gray-300 dark:border-gray-600"
      } rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
      
    >
      <option value="">Select City</option>
      {cities.map((city: any) => (
        <option key={city.id} value={city.id}>
          {city.name}
        </option>
      ))}
    </select>
    {errors.city && errors.city.message && (
      <span className="text-red-500 text-sm">
        {String(errors.city.message)}
      </span>
    )}
  </div>

  {/* Submit Button */}
  <div className="mt-6 flex justify-end">
      <Button
        type="primary"
        Buttonclass="py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg w-[120px] hover:bg-blue-700 dark:hover:bg-blue-600"
        disabled={isLoading}
      >
        Update
      </Button>
    </div>
</form>


    </>
  );
};

export default AddressTab;
