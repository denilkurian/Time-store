import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";

type Document = {
  id: number;
  file_name: string;
  file_url: string;
  mime_type: string;
  size: number;
  created_at: string;
};

type Props = {
  viewData: any;
};

const DocumentsTab: React.FC<Props> = ({ viewData }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoadingDocs(true);
        const response = await axiosInstance.get(`users/${viewData.user_id}/vendor_document`);
        if (response.data.status === "success") {
          const fetchedDocuments = response.data.data.map((item: any) => {
            const { id, file_name, file_url, mime_type, size, created_at } = item.attributes;
            return { id, file_name, file_url, mime_type, size, created_at };
          });
          setDocuments(fetchedDocuments);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchDocuments();
  }, [viewData]);

  return (
<>
<div className="bg-lightmode dark:bg-gray-900 rounded-lg  min-h-[60vh] max-w-[60vw] overflow-auto">
  {viewData.type === "User" && (
    <div className="flex flex-col items-center gap-4 mt-6 max-h-[50vh]">
      {loadingDocs ? (
        <p className="dark:text-white">Loading...</p>
      ) : documents.length === 0 ? (
        <div className="text-gray-500 text-center dark:bg-gray-900">No documents available</div>
      ) : (
        documents.map((doc) => (
          <div key={doc.id} className="w-full h-[100px] max-w-md dark:bg-gray-900">
            <div className="bg-gray-50 p-4 rounded-lg shadow-md relative mx-auto dark:bg-gray-900">
              <a
                href={`http://127.0.0.1:8000${doc.file_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate block mb-2"
              >
                {doc.file_name}
              </a>
              <p className="text-sm text-gray-600">Size: {doc.size} KB</p>
              <p className="text-sm text-gray-400">Type: {doc.mime_type}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )} </div>
</>

  );
};

export default DocumentsTab;
