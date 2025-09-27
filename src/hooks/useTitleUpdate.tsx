import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../redux/reducer/titleSlice";

const useTitleUpdate = (pageTitle: string): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle(pageTitle));
  }, [dispatch, pageTitle]);
};

export default useTitleUpdate;
