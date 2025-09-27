import React from "react";
import Lottie from "lottie-react";
import notFoundAnimation from "../../assets/jsons/404Animation.json";
import useTitleUpdate from "../../hooks/useTitleUpdate";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

const NotFound: React.FC = () => {
  const title = "Not Found 404";
  useTitleUpdate(title);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Lottie animationData={notFoundAnimation} loop={true} style={{ height: 150, width: 300 }} />
      <Button
        type="primary"
        onClick={handleGoBack}
        Buttonclass="-px-1 py-2 text-white rounded-lg hover:bg-blue-700 transition w-[130px]"
      >
        <small>Back to home</small>
      </Button>
    </div>
  );
};

export default NotFound; 
