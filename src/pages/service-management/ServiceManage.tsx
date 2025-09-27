import React from "react";
import Tabs, { Tab } from "../../components/Tab/Tab";
import { RootState } from '../../redux/store/store';
import { useSelector } from 'react-redux';
import Servicelist from "../../pages/service-management/Servicelist";
import ServiceCategory from "../Service-category/ServiceCategory";



const ServiceManage: React.FC = () => {
  const userType = useSelector((state: RootState) => state.auth.userType);
  return (
    <div className="p-6 min-h-screen bg-[#F6EFFF] dark:bg-gray-900 dark:text-white text-black px-3 py-4 h-full">
      <div className="flex flex-col h-full">
        {userType === 'vendor' && (
          <Servicelist />
        )}
        <div className="flex-1">
          {userType === 'admin' && (
            <Tabs>
              <Tab label="Service List" content={<Servicelist />} />

              <Tab label="Service Category " content={<ServiceCategory />} />

            </Tabs>)}
        </div>



      </div>
    </div>
  );
};

export default ServiceManage;
