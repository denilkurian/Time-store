import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig";
import useCustomToast from "../../hooks/useCustomToast";
import Loader from "../../components/Loader/Loader";
import ConfirmationModal from "../User Management/ConfirmationModal";
import { setDocuments, removeDocument } from "../../redux/reducer/documentsSlice";
import { RootState } from "../../redux/store/store";
import { VAL_URL, parseValidationRules} from "../../utils/validationRules";

type ValidationRules = string | { [key: string]: any };

type FileUploadsTabProps = {
  userStatus: string;
};

const FileUploadsTab: React.FC<FileUploadsTabProps> = ({ userStatus }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const documents = useSelector((state: RootState) => state.documents.documents || []);
  const token = useSelector((state: RootState) => state.auth.token);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [validationRules, setValidationRules] = useState<Record<string, ValidationRules>>({});

  const { showToast } = useCustomToast();

  const fetchDocuments = async () => {
    setIsLoading(false);
    try {
      const response = await axiosInstance.get(`/users/${userId}/vendor_document`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const documents =
        response.data?.data?.map((doc: any) => ({
          id: doc.attributes.id,
          file_name: doc.attributes.file_name,
          file_url: doc.attributes.file_url,
        })) || [];

      dispatch(setDocuments(documents));
    } catch (error) {
      console.error("Error fetching documents:", error);
      console.log(validationRules)
      showToast({
        message: "Failed to fetch documents. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!userId || !token || !selectedDocumentId) {
      console.error("No user ID, token, or document ID found");
      return;
    }

    try {
      setIsLoading(false);
      await axiosInstance.delete(`/vendor_document/${selectedDocumentId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(removeDocument(selectedDocumentId));
      showToast({
        message: "Document deleted successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      showToast({
        message: "Failed to delete document. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setSelectedDocumentId(null);
    }
  };

  const openDeleteModal = (id: string) => {
    setSelectedDocumentId(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDocumentId(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (userStatus === "pending_approval") {
      showToast({ message: "Please contact Admin", type: "error" });
      return;
    }

    const files = event.target.files;
    if (!files || files.length === 0 || !userId || !token) return;

    // Check total document limit
    if (documents.length + files.length > 5) {
      showToast({
        message: "Maximum 5 documents allowed",
        type: "error",
      });
      return;
    }

    try {

      setIsLoading(false);
  

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

      // Fetch validation rules from the API
      const validationResponse = await axiosInstance.get(`/validation_rules/vendor_document`);
      const validationRules = validationResponse?.data?.data || {};
      const maxFileSize = validationRules.maxFileSize || 5120; // Default 5MB in KB
      const allowedMimes = validationRules.allowedMimes || ["image/jpeg", "image/png", "application/pdf"];

      const newDocuments = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Perform validation
        const isValidMime = allowedMimes.includes(file.type);
        const isValidSize = file.size / 1024 <= maxFileSize;

        if (!isValidMime) {
          showToast({
            message: `File type not allowed: ${file.name}`,
            type: "error",
          });
          continue;
        }

        if (!isValidSize) {
          showToast({
            message: `File size exceeds limit: ${file.name}`,
            type: "error",
          });
          continue;
        }

        const formData = new FormData();
        formData.append("data[attributes][vendor_document]", file);
        formData.append("user_id", userId);

        const response = await axiosInstance.post(`/vendor_document`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        const newDocument = {
          id: response.data?.data?.id,
          file_name: file.name,
          file_url: response.data?.data?.attributes?.file_path,
        };

        newDocuments.push(newDocument);
      }

      if (newDocuments.length > 0) {
        const updatedDocuments = [...documents, ...newDocuments];
        dispatch(setDocuments(updatedDocuments));

        showToast({
          message: "Document(s) uploaded successfully.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      showToast({
        message: "Failed to upload document. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchDocuments();
    }
  }, [userId]);


  // Fetch validation rules on component mount
  useEffect(() => {
    const fetchValidationRules = async () => {
      try {
        const response = await axiosInstance.get(`${VAL_URL.replace("{type}", "create_vendor_document")}`);
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
    <div className="container mx-auto p-6">
      <div className="rounded-lg p-6 dark:bg-gray-800">
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <span className="text-red-500 dark:text-red-400 text-[15px]">
                *Maximum 5 documents can be uploaded
              </span>

              <div className="flex justify-center items-center">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 p-6 rounded-lg flex flex-col items-center w-[500px]">
                  <label
                    htmlFor="documents"
                    className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Drop your file here or click to upload
                  </label>
                  <input
                    type="file"
                    id="documents"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    multiple
                    onChange={handleFileUpload}
                  />
                  <button
                    onClick={() => document.getElementById("documents")?.click()}
                    className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white dark:text-gray-100 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400"
                    disabled={isLoading}
                  >
                    Select File
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 mt-6">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div key={doc.id} className="w-full max-w-md">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md relative mx-auto">
                        <a
                          href={`http://127.0.0.1:8000${doc.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate block mb-2"
                        >
                          {doc.file_name}
                        </a>
                        <AiOutlineDelete
                          className="text-red-500 dark:text-red-400 cursor-pointer hover:text-red-600 dark:hover:text-red-500 absolute top-2 right-2"
                          onClick={() => openDeleteModal(doc.id)}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    No documents uploaded.
                  </p>
                )}
              </div>

              {/* Delete Modal */}
              <ConfirmationModal
                icon={<FaTrashAlt className="text-2xl text-[#F40A0A]" />}
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                title="Delete Document"
                description="Are you sure you want to delete this document?"
                onConfirm={handleDeleteDocument}
                confirmText="Delete"
                cancelText="Cancel"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadsTab;
