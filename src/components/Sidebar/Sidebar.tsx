import { NavLink } from "react-router-dom";
import { sidebarItems } from "../../data/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Link } from "react-router-dom";

interface SidebarProps {
  // isCollapse: boolean;
  // setIsCollapse: React.Dispatch<React.SetStateAction<boolean>>;
}
const Sidebar: React.FC<SidebarProps> = () => {
  const isCollapse = useSelector((state: RootState) => state.ui.isCollapse);
  const userType = useSelector((state: RootState) => state.auth.userType); 

  return (
    <aside
      className={`bg-[#514E6D] dark:bg-gray-900 z-[999] h-full fixed top-0 left-0 transition-all duration-700 ease-in-out ${isCollapse ? "w-12" : "w-64"
        }`}
    >
      <div
        className={`h-16 flex items-center transition-all duration-700 ease-in-out ${isCollapse ? "justify-center" : "w-64 ps-5"
          }`}
      >
        {/* <img className="w-6 ml-0 mb-5" src={logo} alt="" /> */}
        {!isCollapse && (
          <Link to={'/'} className="text-md text-white text-xl font-semibold ml-5 mb-4">
            Time Store
          </Link>
        )}
      </div>


      {sidebarItems
        .filter((item) => {
          // Conditionally filter "User Management" based on userType
          if (item.name === "Users" && userType !== "admin") {
            return false; // Exclude this item if userType is not admin
          }
          if (item.name === "Dashboard" && userType !== "admin") {
            return false; // Exclude this item if userType is not admin
          }
          if (item.name === "Approvals" && userType !== "admin") {
            return false; // Exclude this item if userType is not admin
          }
          if (item.name === "Enquiries" && userType !== "admin") {
            return false; // Exclude this item if userType is not admin
          }
          return true; // Include other items
        }).map((item, index) => (
        <div
          key={index}
          className={`${isCollapse ? "ms-0 mr-0 mt-2 flex justify-center items-center" : "ms-3 mr-3 mt-2"
            }`}
        >
          <NavLink
            to={item.link}
            className={({ isActive }) =>
              `rounded-md hover:bg-[#0E1248] p-2 flex items-center relative transition-all duration-700 ${isActive ? 'bg-[#0E1248]' : ''}`
            }          >
            <item.icon size={20} className="dark:text-white text-white transition-all duration-700 ease-in-out" />
            {!isCollapse && (
              <span
                className={`overflow-hidden transition-all duration-700 ease-in-out ml-5 font-medium text-sm
                ${isCollapse ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}
                dark:text-white text-white`}
                style={{ whiteSpace: 'nowrap' }}>
                {item.name}
              </span>
            )}
          </NavLink>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
