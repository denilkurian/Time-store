import { RiMenu4Fill } from "react-icons/ri";
import ThemeToggle from "../Theme/ThemeTogle";
import { RxAvatar } from "react-icons/rx";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleCollapse } from "../../redux/reducer/uiSlice";
import useLogout from "../../utils/Logout";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useGetUserByIdQuery } from "../../redux/features/users/userApi";
import { CircularProgress } from "@mui/material";
import UserProfileModal from "../Dashboard/UserProfileModal";
import ContactUsForm from "../../pages/Home/ContactUsForm";

interface NavbarProps {
  isCollapse?: boolean;
  setIsCollapse?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = () => {
  const { userType, userId } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const { data, isLoading } = useGetUserByIdQuery({ userId: Number(userId) });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const isHomePage = location.pathname === "/";
  const isViewProductPage = location.pathname.startsWith("/view-product/");
  const modalRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState<string | null>(null);
  const logoutUser = useLogout();
  const isLogoutLoading = useSelector((state: RootState) => state.auth.isLogoutLoading);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logoutUser();
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (data?.data) {
      setName(data?.data.attributes.first_name);
    }
    console.log(data?.data.attributes.first_name);


    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [data, userId]);

  return (
    <div className={`${isHomePage ? "w-full fixed z-50" : "w-full sticky top-[0px] z-50"}`}>
      {isLogoutLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-black gap-3">
          <CircularProgress className="flex items-center text-white" color="inherit" size={20} thickness={8} /> <p className="text-white">Logging out...</p>
        </div>
      )}
      <nav
        className={`w-full dark:bg-gray-700 bg-[#514E6D] h-12 dark:text-white text-black px-4 py-3 flex items-center transition-all duration-700 ease-in-out ${isHomePage || isViewProductPage ? "justify-end" : "justify-between"
          }`}
      >
        {!isHomePage && !isViewProductPage && (
          <div className="text-lg font-bold">
            <RiMenu4Fill
              className="dark:text-white text-white"
              size={23}
              onClick={() => dispatch(toggleCollapse())}
            />
          </div>
        )}

        <ul className="flex space-x-6 items-center">
            {userType === 'vendor'  && (
              <ContactUsForm /> 
            )}
          <li className="flex items-center">
            <ThemeToggle />
          </li>
          {(userType === "vendor" || userType === "admin" || userType === "customer") && (
            <li className="flex items-center text-white">
              {isLoading ? (
                <CircularProgress color="inherit" size={20} thickness={8} />
              ) : (
                <>
                  <p>{name}</p>
                </>
              )}
            </li>
          )}
          <li className="relative group text-white">
            {(userType === "vendor" || userType === "admin" || userType === "customer") ? (
              <div ref={avatarRef}>
                <RxAvatar onClick={toggleModal} size={25} className="cursor-pointer" />
              </div>
            ) : (
              <Link to="/login" className="text-sm mt-[10px]">
                Login&nbsp;/&nbsp;Register
              </Link>
            )}

            {isModalOpen && userType === "admin" && (
              <div
                ref={modalRef}
                className={`absolute right-[1px] p-3 bg-white dark:bg-gray-700 
                dark:text-white text-black w-40 z-50 rounded-lg`}
              >
                <h1 className="font-medium text-sm mt-[10px]">
                  <Link to="/user-account" onClick={() => setIsModalOpen(false)}>
                    Account
                  </Link>
                </h1>
                <button onClick={handleLogout}>
                  <p className="text-sm mt-[10px]">Logout</p>
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>
      {userType === "vendor" && <UserProfileModal open={isModalOpen} onClose={toggleModal}  />}
    </div>
  );
};

export default Navbar;
