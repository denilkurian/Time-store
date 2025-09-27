import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
// import {  useSelector } from "react-redux";
// import { RootState } from "../../redux/store/store";


interface EditcategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedCategory: { title: string; parentName: string; status: string }) => void;
  category: { no: string; name: string; pname: string; status: string } | null;
  successMessage?: string;  // Add successMessage as an optional string
  error?: string;          // Add error as an optional string
}

const Editcategory: React.FC<EditcategoryProps> = ({ isOpen, onClose, onSubmit, category, successMessage, error }) => {
  const [title, setTitle] = useState('');
  const [parentName, setParentName] = useState('');
  const [status, setStatus] = useState('');

  const [parentOptions, setParentOptions] = React.useState<any[]>([]);

  // Retrieve userId and token from Redux store
  // const userId = useSelector((state: RootState) => state.auth.userId);
  // const token = useSelector((state: RootState) => state.auth.token);



  const fetchAllParentCategories = async () => {
    try {
      let allCategories: any[] = [];
      let currentPage = 1;
      let lastPage = 1;

      do {
        const response = await axiosInstance.get(`/service-categories?page=${currentPage}`);

        console.log("Fetched data for page:", currentPage); // Debugging log
        console.log("Meta response: ", response.data.meta); // Log meta details to debug pagination
        const { data, meta } = response.data;

        // Combine data
        allCategories = [...allCategories, ...data];

        // Update pagination details
        lastPage = meta?.last_page || 1;
        currentPage++;
      } while (currentPage <= lastPage);

      console.log("All combined categories: ", allCategories); // Debugging log

      setParentOptions(allCategories);
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    }
  };


  useEffect(() => {
    fetchAllParentCategories();
  }, [])


  const filteredParentOptions = parentOptions.filter(
    (option) => option.attributes.parent_id === null
  );



  useEffect(() => {
    const prefillFields = () => {
      if (category) {
        console.log("Category fetched for editing: ", category); // Debugging
        setTitle(category.name);

        const matchedParent = parentOptions.find(
          (option) => option.attributes.name === category.pname
        );

        setParentName(matchedParent ? matchedParent.id : '');
        console.log("Setting status: ", category.status);
        setStatus(category.status?.toLowerCase() === 'active' ? 'active' : 'inactive');
      }
    };

    prefillFields();
  }, [category, parentOptions]);




  const handleSubmit = () => {
    if (category) {
      onSubmit({ title, parentName, status });
      onClose();
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-[100]">

      <div className="bg-white dark:bg-white text-black dark:text-black p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
        <div className="mb-4">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          <label htmlFor="title" className="block text-sm font-medium">Category Name</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="parentName" className="block text-sm font-medium">Parent Name</label>
          <select
            id="parentName"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select a Parent Name</option>
            {filteredParentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.attributes.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          >  <option value="">Select</option>
            <option value="active">active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-900 text-white rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editcategory;
