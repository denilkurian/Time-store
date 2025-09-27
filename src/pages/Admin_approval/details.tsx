import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';

type Props = {
  viewData: any;
};

const DetailsTab: React.FC<Props> = ({ viewData }) => {
  const [isExcerptExpanded, setIsExcerptExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [SubcategoryName, setSubCategoryName] = useState<string | null>(null);

  const [business, setBusiness] = useState<string | null>(null);
  const [pan, setPan] = useState<string | null>(null);
  const [cin, setCin] = useState<string | null>(null);
  const [gst, setGst] = useState<string | null>(null);
  const [serviceUnits, setServiceUnits] = useState<Record<string, string>>({});
  // Fetch category name based on category_id
  useEffect(() => {
    const fetchCategoryName = async (categoryId: number) => {
      try {
        let response;
        if (viewData.type === 'Product') {
          response = await axiosInstance.get(`/product-categories/${categoryId}`);
          if (response.data.status === 'success' && response.data.message?.attributes?.name) {
            setCategoryName(response.data.message.attributes.name);
          }
        }
        else if (viewData.type === 'Service') {
          response = await axiosInstance.get(`/service-categories/${categoryId}`);
          if (response.data.status === 'success' && response.data.message?.attributes?.name) {
            setCategoryName(response.data.message.attributes.name);
          }
        }


      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    if (viewData?.category_id) {
      fetchCategoryName(viewData.category_id);
    }
  }, [viewData?.category_id]);


  // Fetch vendor details
  useEffect(() => {
    const fetchVendorProfile = async (vendor_Id: number) => {
      try {
        const response = await axiosInstance.get(`/vendor_profiles/${vendor_Id}`);
        if (response.data.status === 'success' && response.data?.data?.attributes?.user_id) {
          setBusiness(response.data.data.attributes.business_entity);
          setPan(response.data.data.attributes.pan_no)
          setCin(response.data.data.attributes.cin)
          setGst(response.data.data.attributes.gst_no)
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    if (viewData?.user_id) {
      fetchVendorProfile(viewData.user_id);
    }
  }, [viewData?.user_id]);


  // Fetch category name based on Subcategory_id
  useEffect(() => {
    const fetchSubCategoryName = async (SubcategoryId: number) => {
      try {
        let response;
        if (viewData.type === 'Product') {
          response = await axiosInstance.get(`/product-categories/${SubcategoryId}`);
          if (response.data.status === 'success' && response.data.message?.attributes?.name) {
            setSubCategoryName(response.data.message.attributes.name);
          }
        }
        else if (viewData.type === 'Service') {
          response = await axiosInstance.get(`/service-categories/${SubcategoryId}`);
          if (response.data.status === 'success' && response.data.message?.attributes?.name) {
            setSubCategoryName(response.data.message.attributes.name);
          }

        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    if (viewData?.sub_category_id) {
      fetchSubCategoryName(viewData.sub_category_id);
    }
  }, [viewData?.sub_category_id]);



  useEffect(() => {
    const fetchServiceUnits = async () => {
      try {
        const response = await axiosInstance.get("/service-units");
        const units = response.data.data;

        // Create ID-to-name mapping
        const mapping = units.reduce((acc: Record<string, string>, unit: { id: string; name: string })=> {
          acc[unit.id] = unit.name;
          return acc;
        }, {});

        setServiceUnits(mapping);
      } catch (error) {
        console.error("Error fetching service units:", error);
      }
    };

    fetchServiceUnits();
  }, []);

  // const serviceUnitName = serviceUnits.find(unit => unit.id === viewData.service_unit)?.name || 'N/A';

  if (!viewData) return <div className="text-gray-500">No details available</div>;

  const handleExcerptToggle = () => setIsExcerptExpanded((prev) => !prev);
  const handleDescriptionToggle = () => setIsDescriptionExpanded((prev) => !prev);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return isExcerptExpanded || isDescriptionExpanded
        ? text
        : `${text.slice(0, maxLength)}...`;
    }
    return text;
  };

  return (
    <div className="bg-lightmode dark:bg-gray-900 m-2 p-10 rounded-lg min-h-[60vh] max-w-[60vw] overflow-auto">
      <h2 className="text-lg font-bold mb-6 dark:text-white">
        {viewData.type === 'Product' ? 'Product Details' : viewData.type === 'Service' ? 'Service Details' : 'Vendor Details'}
      </h2>
      <div className="grid grid-cols-2 gap-8 max-h-[50vh]">
        {(viewData.type === 'Product' || viewData.type === 'Service') ? (
          <>
            <div>
              <p className="text-xs font-medium text-gray-500">Name</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{viewData.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Category</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{categoryName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">SubCategory</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{SubcategoryName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">MRP</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">₹  {viewData.mrp || 'N/A'}</p>
            </div>
            {viewData.type === 'Service' &&
              <div>
                <p className="text-xs font-medium text-gray-500">Service Unit</p>
                <p className="text-sm dark:text-white text-gray-800 mt-1"> {serviceUnits[viewData.service_unit] || 'N/A'}</p>
              </div>}

            <div className="col-span-2">
              <p className="text-xs font-medium text-gray-500">Excerpt</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1 whitespace-pre-line overflow-y-auto max-h-60 w-full">
                {truncateText(viewData.excerpt || 'N/A', 100)}
              </p>
              {viewData.excerpt && viewData.excerpt.length > 100 && (
                <button
                  className="text-blue-500 mt-2 text-xs"
                  onClick={handleExcerptToggle}
                >
                  {isExcerptExpanded ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>

            <div className="col-span-2">
              <p className="text-xs font-medium text-gray-500">Description</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1 whitespace-pre-line overflow-y-auto max-h-60 w-full">
                {truncateText(viewData.description || 'N/A', 100)}
              </p>
              {viewData.description && viewData.description.length > 100 && (
                <button
                  className="text-blue-500 mt-2 text-xs"
                  onClick={handleDescriptionToggle}
                >
                  {isDescriptionExpanded ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Minimum Order</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{viewData.minimum_order || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Status</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{viewData.status || 'N/A'}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs font-medium text-gray-500">Name</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{viewData.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Email</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{viewData.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Phone</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{viewData.phone_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Business Entity</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{business || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Pan Number</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{pan || 'N/A'}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">CIN Number</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{cin || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">GST Number</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{gst || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Status</p>
              <p className="text-sm dark:text-white text-gray-800 mt-1">{viewData.status || 'N/A'}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailsTab;
