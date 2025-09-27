import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import useCustomToast from "../../hooks/useCustomToast";
import { useLocation } from "react-router-dom";
import {
  setFiles,
  setLoading,
  removeFile,
  setDisplayPicture
} from "../../redux/features/serviceImage/imageSlice";

// interface FileItem {
//   id: string;
//   file_name: string;
//   file_url: string;
// }

// interface ServiceimagesProps {
//   onUpload: (images: FileItem[]) => void;
// }

const ServiceImages: React.FC = () => {
  const dispatch = useDispatch();
  const { files, isLoading, displayPictureId } = useSelector((state: RootState) => state.images);
  const location = useLocation();
  const serviceId = location.state?.serviceId;
  const [dpLoading, setDpLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const { showToast } = useCustomToast();
  const loadInitialImages = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get(`/services/${serviceId}/images`);
      const images = response.data.data.map((item: any) => ({
        id: item.id.toString(),
        file_name: item.attributes.file_name,
        file_url: `http://127.0.0.1:8000/storage/${item.attributes.file_path}`,
      }));

      // Fetch the display picture ID
      const dpResponse = await axiosInstance.get(`/services/${serviceId}`);
      // const displayPictureId = dpResponse.data.data?.id?.toString() || '';


      // if (response.status === 200) {
      const displayPictureId = dpResponse.data.data.attributes.display_picture;
      dispatch(setDisplayPicture(displayPictureId)); // Update Redux store
      console.log("displayPicture", displayPictureId)
      // }


      dispatch(setFiles(images));
      // dispatch(setDisplayPicture(displayPictureId));
      // console.log("displayPictureId1",displayPictureId)
      // if (typeof onUpload === "function") {
      //   onUpload(images);
      // }
    } catch (error) {
      console.error("Error loading images:", error);
      // dispatch(setError("Failed to load images. Please try again."));
      showToast({
        message: "Please try again",
        type: "error",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Image Upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Restricting maximum files to 5
    const allowedFiles = Array.from(selectedFiles).slice(0, 5);
    if (allowedFiles.length > 5) {
      showToast({
        message: "You can upload a maximum of 5 images.",
        type: "error",
      });
      return;
    }

    let successCount = 0; // Count of successful uploads
    let failureCount = 0; // Count of failed uploads
    const success_message: string[] = [];
    const error_message: string[] = [];

    const uploadPromises = allowedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("data[attributes][service_image]", file);
      formData.append("data[attributes][name]", file.name);
      formData.append("data[attributes][description]", "Image description");


      try {

        const response = await axiosInstance.post(
          `/services/${serviceId}/images`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.status === 200) {
          successCount++; // Increment success count
          success_message.push(response.data.message)
          error_message.length = 0;
        } else {
          failureCount++; // Increment failure count
          error_message.push(response.data.message || "Failed to upload image.");
          throw new Error(response.data.message);
        }

      } catch (error: any) {
        console.error(`Error uploading "${file.name}":`, error);
        failureCount++; // Increment failure count
      }
      finally {

      }
    });

    try {
      dispatch(setLoading(true));
      await Promise.all(uploadPromises); // Upload files concurrently
      await loadInitialImages(); // Refresh uploaded images
    } finally {
      dispatch(setLoading(false));

      if (successCount > 0) {
        const message = `${successCount} files uploaded Successfully`;
        showToast({
          message: message,
          type: "success", // Show warning if any failed uploads
        });
      }

      else if (successCount > 0 && failureCount > 0) {
        const message = `${successCount} images uploaded. ${failureCount} failed.`;
        showToast({
          message: message,
          type: failureCount > 0 ? "info" : "success", // Show warning if any failed uploads
        });
      }

      else {
        showToast({
          message: `${error_message[0]}`,
          type: "info",
        });
      }
    }
    error_message.length = 0;
  };



  const handleSetDisplayPicture = async (id: string) => {
    try {
      // dispatch(setLoading(true));
      setDpLoading(id);
      const response = await axiosInstance.post(`/services/${serviceId}/dp/${id}`);

      if (response.status === 200) {
        dispatch(setDisplayPicture(id)); // Store the display picture ID in the Redux store
        showToast({
          message: "Display picture set successfully",
          type: "success",
        });
      } else {
        showToast({
          message: "Failed to set display picture",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error setting display picture:", error);
      showToast({
        message: "Failed to set display picture. Please try again",
        type: "error",
      });
    } finally {
      // dispatch(setLoading(false));
      setDpLoading(null);
    }
  };


  useEffect(() => {
    handleSetDisplayPicture
  }, []
  )


  const handleDeleteDisplayPicture = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.delete(`/services/${serviceId}/dp`);

      if (response.status === 200) {
        dispatch(setDisplayPicture('')); // Clear display picture ID
        showToast({
          message: "Display picture removed successfully",
          type: "success",
        });
      } else {
        showToast({
          message: "Failed to remove display picture",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error removing display picture:", error);
      showToast({
        message: "Failed to remove display picture. Please try again",
        type: "error",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      // dispatch(setLoading(true));
      setDeleteLoading(id);
      const response = await axiosInstance.delete(`/services_images/${id}`);

      if (response.status === 200) {
        dispatch(removeFile(id));
        showToast({
          message: "Image deleted successfully",
          type: "success",
        });
      } else {
        showToast({
          message: "Failed to delete image",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      // dispatch(setError("Failed to delete image. Please try again."));
      showToast({
        message: "Failed to delete. Please try again",
        type: "error",
      });
    } finally {
      // dispatch(setLoading(false));
      setDeleteLoading(null);
    }
  };

  useEffect(() => {
    if (serviceId) {
      loadInitialImages();
    }
  }, [serviceId]);




  return (
    <div className="container mx-auto p-6">
      <div className="rounded-lg p-6">
        <div className="flex flex-col gap-6">
          <span className="text-red-500 dark:text-red-400 text-[15px]">
            *Maximum 5 images can be uploaded
          </span>
          <div className="flex justify-center items-center">
            <div className="border-2 border-dashed border-gray-300 bg-gray-200 p-6 rounded-lg flex flex-col items-center w-full">
              <label
                htmlFor="documents"
                className="text-gray-500 cursor-pointer hover:text-blue-600"
              >
                Drop your file here or click to upload
              </label>
              <input
                type="file"
                id="documents"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileUpload} // Updated handler
              />
              <button
                onClick={() => document.getElementById("documents")?.click()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Select File
              </button>
            </div>

          </div>

          <div className="flex flex-wrap gap-6 mt-6">
            {isLoading ? (
              <div className="w-full text-center py-8">
                <p className="text-gray-500 text-lg animate-pulse">Loading images...</p>
              </div>
            ) : files.length > 0 ? (
              files.map((file) => (
                <div
                  key={file.id}
                  className="relative rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 sm:w-1/2 md:w-1/4 lg:w-1/5"
                >
                  {/* Image */}
                  <div className="relative w-full h-40">


                    <img
                      src={file.file_url}
                      alt={file.file_name}
                      className={`w-full h-40 object-cover border-b border-gray-200 transition-opacity duration-300 ${dpLoading === file.id ? "opacity-50" : "opacity-100"
                        }`}
                    />

                    {/* "Setting..." Overlay */}
                    {dpLoading === file.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <p className="text-white text-sm font-semibold animate-pulse">Setting...</p>
                      </div>
                    )}
                    {deleteLoading === file.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <p className="text-red-500 text-sm font-semibold animate-pulse">Deleting...</p>
                      </div>
                    )}
                  </div>

                  {/* File Actions */}
                  <div className="p-3 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteImage(file.id)}
                        className="px-3 py-1 border border-red-500 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition"
                      >
                        Delete
                      </button>

                      {/* Set as Display Picture */}
                      <input
                        type="radio"
                        checked={displayPictureId == file.id}
                        onChange={() => handleSetDisplayPicture(file.id)}
                        title="Set as Display Picture"
                        className="h-5 w-5 accent-blue-600 cursor-pointer"
                      />
                    </div>

                    {/* Remove DP Button */}
                    {displayPictureId == file.id && (
                      <button
                        onClick={handleDeleteDisplayPicture}
                        className="w-full px-3 py-1 border border-green-500 text-green-500 rounded-lg text-sm font-semibold hover:bg-green-500 hover:text-white transition"
                      >
                        Remove as Display Picture
                      </button>
                    )}

                    {/* File Name */}
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-blue-600 dark:text-blue-400 text-sm truncate hover:underline mt-2"
                    >
                      {file.file_name}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8">
                <p className="text-gray-400 text-lg">No images available.</p>
              </div>
            )}
          </div>



        </div>
      </div>
    </div>
  );
};

export default ServiceImages;
