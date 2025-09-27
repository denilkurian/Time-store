
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { useLocation } from "react-router-dom";
interface MainLayoutProps {
  children: React.ReactNode;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation(); //getting current location path
  const isCollapse = useSelector((state: RootState) => state.ui.isCollapse);

  const isHomePage = location.pathname === "/";
  const isViewProductPage = location.pathname.startsWith("/view-product/");

  return (
    <div className="flex h-screen">
      {/*render Sidebar based on the current route */}
      {!isHomePage && !isViewProductPage && <Sidebar />}
      
      <div
        className={
          isHomePage || isViewProductPage
            ? "flex flex-col flex-1"
            : isCollapse
            ? "flex flex-col flex-1 ml-12 transition-all duration-700 ease-in-out"
            : "flex flex-col flex-1 ml-64 transition-all duration-700 ease-in-out"
        }
      >
        <Navbar />

        <main className={`flex-1 dark:bg-gray-800  pb-0 mb-0 shrink ${isHomePage ? 'p-0 w-full' : 'p-3'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
