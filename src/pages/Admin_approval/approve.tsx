import React from "react";
import Heading from "../../components/Heading/Heading";

const DetailsTab: React.FC = () => {
  return (
    <div className="bg-[#F6EFFF] h-full p-10 pt-5 rounded-lg shadow-md">
      <Heading className=" mb-5 " title="Admin Approvals" />
      <form className="grid grid-cols-2 gap-8 bg-white p-5">
      
        {/* Vendor Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
          <input
            type="text"
            disabled
            value="John Sac"
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-gray-100"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="text"
            disabled
            value="120000/-"
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-gray-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            disabled
            value="johnsac@gmail.com"
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-gray-100"
          />
        </div>

        {/* Vendor */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Vendor</label>
          <input
            type="text"
            disabled
            value="Robert"
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-gray-100"
          />
        </div>

        {/* Product */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product</label>
          <select
            value="Mobile"
            disabled
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-gray-100"
          >
            <option value="Mobile">Mobile</option>
            <option value="Laptop">Laptop</option>
          </select>
        </div>

        {/* Sub-Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Sub-Categories</label>
          <select
            value="Iphone 16+"
            disabled
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-gray-100"
          >
            <option value="Iphone 16+">Iphone 16+</option>
            <option value="Samsung S23">Samsung S23</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            value="2"
            disabled
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-gray-100"
          />
        </div>

        {/* Create Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Create Date</label>
          <input
            type="date"
            value="2024-11-20"
            disabled
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-gray-100"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value="Active"
            disabled
            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-gray-100"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      <div className="mt-10 flex justify-end space-x-4">
        <button
          type="button"
          className="px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => alert("Approved")}
        >
          Approve
        </button>
        <button
          type="button"
          className="px-8 py-3 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={() => alert("Rejected")}
        >
          Reject
        </button>
      </div>
      </form>

      {/* Buttons */}
    </div>
  );
};

export default DetailsTab;
