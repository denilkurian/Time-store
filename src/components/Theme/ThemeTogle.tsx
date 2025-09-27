import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from '../../redux/store/store'
import { toggleTheme } from "../../redux/reducer/themeSlice"; 
import { IoMoon } from "react-icons/io5";
import { IoSunny } from "react-icons/io5";

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleToggle = () => {
    dispatch(toggleTheme());
    localStorage.setItem("darkMode", JSON.stringify(!darkMode)); 
  };

  return (
    <>
    <button
      onClick={handleToggle}
      
    >
      {darkMode ? <IoSunny color="white" size={23} /> : <IoMoon color="black" size={20} />}
    </button>
    </>
  );
};

export default ThemeToggle;
