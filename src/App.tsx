import { BrowserRouter as Router, } from "react-router-dom";
import Routes from "./routes/routes";
import './App.css'
import { useEffect } from "react";
import { setDarkMode } from "./redux/reducer/themeSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "./redux/store/store";
import { Helmet } from "react-helmet";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  // Apply dark mode class based on Redux state
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("darkMode") || "false");
    dispatch(setDarkMode(savedMode));
  }, [dispatch]);

  const title = useSelector((state: RootState) => state.title.title);
  console.warn = () => {}; // Disable warnings

  return (
    <>
      <Router>
        <Helmet>
          <title>Time Store{title}</title>
        </Helmet>
        <Routes />
      </Router>
    </>
  )
}

export default App
