import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";

type AddressDetailsType = {
  street_address: string;
  postal_code: string;
  city_id: number;
  state_id: number;
  country_id: number;
  created_at: string;
  updated_at: string;
};

type Props = {
  viewData: any;
};

const AddressTab: React.FC<Props> = ({ viewData }) => {
  const [addressDetails, setAddressDetails] = useState<AddressDetailsType | null>(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoadingDocs(true);
        const response = await axiosInstance.get(`vendor_address/${viewData.user_id}`);
        if (response?.data?.status === "success") {
          const data = response?.data?.data?.attributes;
          setAddressDetails({
            street_address: data?.street_address,
            postal_code: data?.postal_code,
            city_id: data?.city_id,
            state_id: data?.state_id,
            country_id: data?.country_id,
            created_at: data?.created_at,
            updated_at: data?.updated_at,
          });
        }
      } catch (error) {
        console.error("Error fetching address details:", error);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchAddress();
  }, [viewData]);

  useEffect(() => {
    if (addressDetails?.country_id) {
      const fetchCountry = async () => {
        try {
          setLoadingDocs(true);
          const response = await axiosInstance.get(`countries/${addressDetails.country_id}`);
          if (response?.data?.status === "success") {
            const data = response?.data?.data?.name;
            setCountry(data);
          }
        } catch (error) {
          console.error("Error fetching Country:", error);
        } finally {
          setLoadingDocs(false);
        }
      };
      fetchCountry();
    }
  }, [addressDetails?.country_id]);

  useEffect(() => {
    if (addressDetails?.state_id) {
      const fetchState = async () => {
        try {
          setLoadingDocs(true);
          const response = await axiosInstance.get(`states/${addressDetails.state_id}`);
          if (response?.data?.status === "success") {
            const data = response?.data?.data?.name;
            setState(data);
          }
        } catch (error) {
          console.error("Error fetching State:", error);
        } finally {
          setLoadingDocs(false);
        }
      };
      fetchState();
    }
  }, [addressDetails?.state_id]);

  useEffect(() => {
    if (addressDetails?.city_id) {
      const fetchCity = async () => {
        try {
          setLoadingDocs(true);
          const response = await axiosInstance.get(`cities/${addressDetails.city_id}`);
          if (response?.data?.status === "success") {
            const data = response?.data?.data?.name;
            setCity(data);
          }
        } catch (error) {
          console.error("Error fetching City:", error);
        } finally {
          setLoadingDocs(false);
        }
      };
      fetchCity();
    }
  }, [addressDetails?.city_id]);

  return (
    <>
      <div className="bg-lightmode dark:bg-gray-900 m-2 p-10 rounded-lg  min-h-[60vh] max-w-[60vw] overflow-auto">
        {viewData.type === "User" && (
          <div className="">
            {loadingDocs ? (
              <div className="dark:text-white">Loading...</div>
            ) : addressDetails ? (
              <div className="">
                <h1 className="mb-5 text-lg font-bold dark:text-white">Vendor Address Details</h1>
                <form className="grid grid-cols-2 gap-8 bg-lightmode dark:bg-gray-900 p-5">
                  {/* Street Address */}
                  <div>
                    <p className="text-xs font-medium text-gray-500">Street Address</p>
                    <p className="text-sm dark:text-white text-gray-800 mt-1">{addressDetails?.street_address || "N/A"}</p>
                  </div>

                  {/* Postal Code */}
                  <div>
                    <p className="text-xs font-medium text-gray-500">Postal Code</p>
                    <p className="text-sm dark:text-white text-gray-800 mt-1">{addressDetails?.postal_code || "N/A"}</p>
                  </div>

                  {/* State */}
                  <div>
                    <p className="text-xs font-medium text-gray-500">State</p>
                      <p className="text-sm dark:text-white text-gray-800 mt-1">
                        {state || "N/A"}</p>
                  </div>

                  {/* City */}
                  <div>
                    <p className="text-xs font-medium text-gray-500">City</p>
                    <p className="text-sm dark:text-white text-gray-800 mt-1">{city || "N/A"}</p>
                  </div>

                  {/* Country */}
                  <div>
                    <p className="text-xs font-medium text-gray-500">Country</p>
                    <p className="text-sm dark:text-white text-gray-800 mt-1">{country || "N/A"}</p>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-[#F6EFFF] h-full p-10 pt-5 rounded-lg shadow-md">
                <h1 className="text-lg font-bold">No Address Found</h1>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AddressTab;
