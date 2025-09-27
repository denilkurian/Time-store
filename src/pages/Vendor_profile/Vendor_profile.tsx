import React, { useState, useEffect } from "react";
import useTitleUpdate from "../../hooks/useTitleUpdate";
import Tabs, { Tab } from "../../components/Tab/Tab";
import Snackbar from "../../components/Snackbar/Snackbar";
import { FormProvider, useForm } from "react-hook-form";
import DetailsTab from "./DetailsTab";
import AddressTab from "./AddressTab";
import FileUploadsTab from "./FileUploadsTab";
import { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import ApprovalButton from "../../components/Button/ApprovalButton";
import axiosInstance from "../../utils/axiosConfig"; 

const VendorProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [userStatus, setUserStatus] = useState<string | null>(null); 
  const methods = useForm({ mode: "onSubmit" });

  const { userId } = useSelector((state: RootState) => ({
    userId: state.auth.userId,
  }));

  useTitleUpdate("VendorProfile");

  const showSnackbar = (msg: string) => {
    setMessage(msg);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => setSnackbarOpen(false);

  // Fetch user data and extract userStatus
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`, {
        headers: {
          Accept: "application/json",
        },
      });
      if (response.data?.data?.attributes?.status) {
        const status = response.data.data.attributes.status;
        setUserStatus(status);
        console.log("User Status:", status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      showSnackbar("Failed to fetch user data.");
      console.log(loading)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Determine if the approval button should be disabled based on userStatus
  const isApprovalButtonDisabled = userStatus === "blocked" || userStatus === "pending_change_approval" || userStatus === "pending_approval";

  return (

    <FormProvider {...methods}>
      <div className="bg-[#F6EFFF] dark:bg-gray-900 dark:text-white text-black px-3 py-4 h-full overflow-scroll overflow-x-hidden">
        <div className="flex justify-end mt-4 mr-4">
          {isApprovalButtonDisabled ? <button
            className="bg-gray-400 text-white cursor-not-allowed opacity-50 rounded-lg p-3"
            disabled >
            Approval Pending</button> :
            <ApprovalButton
            type="Profile"
              entity="User"
              purpose={userStatus === "active" ? "profile_edit_approval" : "profile_approval"}
              id={userId ? Number(userId) : 0}
              url="/product-management"
              // disabled={isApprovalButtonDisabled}
              // onError={(error) => showSnackbar(`Error submitting approval: ${error.message}`)}
              onSuccess={() => showSnackbar("Approval submitted successfully")}
              className={`px-4 py-2 rounded-md ${isApprovalButtonDisabled
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700 text-white"
                }`}
            />}


        </div>

        <Tabs>
          <Tab label="Details" content={<DetailsTab userStatus={userStatus || ""}/>} />
          <Tab label="Address" content={<AddressTab userStatus={userStatus || ""} />} />
          <Tab label="Documents" content={<FileUploadsTab userStatus={userStatus || ""} />} />
        </Tabs>
        <Snackbar open={snackbarOpen} onClose={closeSnackbar} message={message} />
      </div>
    </FormProvider>
  );
};

export default VendorProfile;
