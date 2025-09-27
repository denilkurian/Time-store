import {
  Routes,
  Route,

} from "react-router-dom";
import NotFound from "../Errors/NotFound/NotFound";
import Login from "../pages/Login/Login";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../auth/Protectedroute";
import { UserAccount } from "../pages/Account/AccountManagement";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import ProductCategory from "../pages/Product-category/ProductCategory";
import AdminApproval from "../pages/Admin_approval/admin_approval";
// import ViewApproval from "../pages/Admin_approval/view_approval";
import ApproveReject from "../pages/Admin_approval/approve";


import VendorProfile from "../pages/Vendor_profile/Vendor_profile";
import ContactForm from "../components/Contact/contactform"; 
import UserManagement from "../pages/User Management/User_Management";
import ProductManage from "../pages/Product-management/ProductManage"
import Editproduct from "../pages/Product-management/Editproduct"


import { UserBlockedPage } from "../pages/Account/UserVerificationPage";
import { Toaster } from "react-hot-toast";
import HomePage from "../pages/Home/HomePage";
import ViewSingleProduct from "../pages/Home/ViewSingleProduct";
import { EnquiryList } from "../pages/Produt-Enquiry/EnquiryList";
import ServiceCategory from "../pages/Service-category/ServiceCategory";
import ServiceManage from "../pages/service-management/ServiceManage";
import Editservice from "../pages/service-management/Editservice";
import LocationForm from "../pages/Locations";
const routes = () => {




  return (
    <>
      <Toaster
        toastOptions={{
          className: "bg-[#e4daf1] dark:bg-gray-800 dark:text-white text-black",
          style: {
            height: "50px",
          },
        }}
      />

      <Routes >
        <Route path="/" element={<MainLayout> <HomePage /></MainLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute requiredUserType="admin"><MainLayout> <DashboardHome /></MainLayout></ProtectedRoute>} />
        <Route path="/user-management" element={<ProtectedRoute requiredUserType="admin"><MainLayout> <UserManagement /></MainLayout></ProtectedRoute>} />
        {/* <Route path="/user-profile" element={<ProtectedRoute><MainLayout> <Profile /></MainLayout></ProtectedRoute>} /> */}
        <Route path="/admin-approval" element={<ProtectedRoute requiredUserType="admin"><MainLayout> <AdminApproval /></MainLayout></ProtectedRoute>}  />
        {/* <Route path="/view-approval/:id" element={<MainLayout> <ViewApproval /></MainLayout>}  /> */}
        <Route path="/approve-reject/:id" element={<MainLayout> <ApproveReject /></MainLayout>}  />
        <Route path="/user-account" element={<ProtectedRoute><MainLayout> <UserAccount /></MainLayout></ProtectedRoute>} />
        <Route path="/product-category" element={<ProtectedRoute><MainLayout> <ProductCategory /></MainLayout></ProtectedRoute>} />
        <Route path="/view-product/:id/:pageType" element={<MainLayout> <ViewSingleProduct /></MainLayout>} />
        <Route path="/vendor-profile" element={<ProtectedRoute requiredUserType="vendor"><MainLayout> <VendorProfile /></MainLayout></ProtectedRoute>} />
        <Route path="/product-management" element={<ProtectedRoute><MainLayout> <ProductManage /></MainLayout></ProtectedRoute>} />
        <Route path="/service-management" element={<ProtectedRoute><MainLayout> <ServiceManage /></MainLayout></ProtectedRoute>} />
        <Route path="/service-category" element={<ProtectedRoute><MainLayout> <ServiceCategory /></MainLayout></ProtectedRoute>} />
        <Route path="/contact-form" element={<MainLayout> <ContactForm /></MainLayout>}  />
        <Route path="/user-blocked" element={<UserBlockedPage />} />
        <Route path="/edit-product/:id" element={<ProtectedRoute requiredUserType="vendor"><MainLayout> <Editproduct /></MainLayout></ProtectedRoute>} />
        <Route path="/edit-service/:id" element={<ProtectedRoute requiredUserType="vendor"><MainLayout> <Editservice /></MainLayout></ProtectedRoute>} />
        <Route path="/product-enquiry" element={<ProtectedRoute requiredUserType="admin"><MainLayout> <EnquiryList /></MainLayout></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/location" element={<MainLayout> <LocationForm /></MainLayout>}  />
      </Routes> 
    </>
  );
};

export default routes;
