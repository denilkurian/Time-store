import { IconType } from "react-icons";
import { MdOutlineDashboard } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
// // import { LuUsers2 } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { MdOutlineMedicalServices } from "react-icons/md";
// import { MdContacts } from "react-icons/md";
// import { RootState } from '../../redux/store/store';
// import { useSelector } from 'react-redux';



interface SidebarItem {
    name: string;
    icon: IconType;
    link: string;
}

// const userType = useSelector((state: RootState) => state.auth.userType);

export const sidebarItems: SidebarItem[] = [

    { name: "Dashboard", icon: MdOutlineDashboard, link: "/dashboard" },

    { name: "Users", icon: LuUsers, link: "/user-management" },
    // { name: "Account Management", icon: TbReportAnalytics, link: "/user-account" },
    { name: "Approvals", icon: TbReportAnalytics, link: "/admin-approval" },
    // {name:"Contact",icon:MdContacts ,link:"/contact-form"},
    { name: "Products", icon: FiBox, link: "/product-management" },
    // { name: "Product", icon: FiBox, link: "/product" },
    { name: "Services", icon: MdOutlineMedicalServices , link: "/service-management" },
    { name: "Enquiries", icon: TbReportAnalytics, link: "/product-enquiry" },
    // { name: "Bidding", icon: TbReportAnalytics, link: "/vendor-profisle" },
    // { name: "Quotation", icon: TbReportAnalytics, link: "/vendor-profsile" },
    // { name: "Extra", icon: TbReportAnalytics, link: "/vendor-profisle" },
];

