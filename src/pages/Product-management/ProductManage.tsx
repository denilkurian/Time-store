import React from "react";
import Tabs, { Tab } from "../../components/Tab/Tab";
import ProductCategory from "../Product-category/ProductCategory";
import ProductList from "../Product-management/ProductList";
import { RootState } from '../../redux/store/store';
import { useSelector } from 'react-redux';



const ProductManage: React.FC = () => {
  const userType = useSelector((state: RootState) => state.auth.userType);
  return (
    <div className="p-6 min-h-screen bg-[#F6EFFF] dark:bg-gray-900 dark:text-white text-black px-3 py-4 h-full">
      {userType === 'vendor' && (
        <ProductList />
      )}
      {/* Tabs Section */} {userType === 'admin' && (
      <Tabs className="mb-0">
     
        <Tab label="Product List" content={<ProductList />} />
       
          <Tab label="Category List" content={<ProductCategory />} />
        
      </Tabs>
  )}
    </div>
  );
};

export default ProductManage;
