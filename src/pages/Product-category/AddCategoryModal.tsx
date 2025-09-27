import React from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import useCustomToast from "../../hooks/useCustomToast";


interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { title: string; parentName: string; status: string }) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = React.useState("");
  const [parentName, setParentName] = React.useState("");
  const [parentOptions, setParentOptions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [successMessage, setSuccessMessage] = React.useState<string>("");
  const { showToast } = useCustomToast();


  // Retrieve userId and token from Redux store
  const userId = useSelector((state: RootState) => state.auth.userId);
  const token = useSelector((state: RootState) => state.auth.token);

  // Fetch parent category options from the API
  React.useEffect(() => {
    const fetchAllParentCategories = async () => {
      try {
        const config = token
          ? {
            headers: {
              Authorization: `Bearer ${token}`,
              "user-id": userId,
            },
          }
          : {};

        let allCategories: any[] = [];
        let currentPage = 1;
        let lastPage = 1;

        do {
          const response = await axiosInstance.get(`/product-categories?page=${currentPage}`, config);

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

    fetchAllParentCategories();
  }, [token, userId]);



  // Filter for categories with parent_id === null
  const filteredParentOptions = parentOptions.filter(
    (option) => option.attributes.parent_id === null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    setSuccessMessage("");


    const newCategory = {
      "data": {
        "attributes": {
          "name": title,
          "parent_id": parentName,
          "status": "active",
        }
      }
    }


    const config = token
      ? {
        headers: {
          Authorization: `Bearer ${token}`,
          "user-id": userId,
        },
      }
      : {};

    try {
      const response = await axiosInstance.post("/product-categories", newCategory, config);

      if (response.status === 200) {
        onSubmit({
          title: response.data.data.attributes.name,
          parentName: parentName
            ? parentOptions.find((option) => option.id === parentName)?.attributes?.name || "None"
            : "None",
          status: "Active",
        });

        setTitle("");
        setParentName("");
        showToast({
          message: 'Product Category Added successfully!',
          type: 'success',
          duration: 3000,
        });
        onClose();
      }

      else if (response.status === 403) {
        showToast({
          message: "Category Already Exists",
          type: "error",
          duration: 3000,
        });
      }

    } catch (error: any) {
      showToast({
        message: "Error adding category.",
        type: "error",
        duration: 3000,
      }); console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-white text-black dark:text-black w-96 p-6 rounded-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">

            <label htmlFor="parentName" className="block text-sm font-medium mb-1">
              Parent Name
            </label>
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
          <div className="mb-4"><p className="text-xs text-green-700">If a parent name is not selected, the category name will be used as the parent name.</p>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
