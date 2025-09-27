
import { toast } from 'react-hot-toast';
import Lottie from 'lottie-react';
import successAnimation from '../assets/jsons/success.json'
import errorAnimation from '../assets/jsons/error.json'
import infoAnimation from '../assets/jsons/info.json'

type ToastOptions = {
  message: string;
  duration?: number;
  iconAnimation?: any;
  type?: 'success' | 'error' | 'loading' | 'info' | 'warning'; 
};

const useCustomToast = () => {
  const showToast = ({
    message,
    duration = 3000,
    iconAnimation,
    type = 'success',
  }: ToastOptions) => {
    switch (type) {
      case 'success':
        toast.success(message, {
          duration,
          icon: (
            <Lottie
              animationData={successAnimation}
              loop={true}
              style={{ height: 60, width: 60 }}
            />
          ),
        });
        break;
      case 'error':
        toast.error(message, {
          duration,
          icon: (
            <Lottie
              animationData={errorAnimation}
              loop={true}
              style={{ height: 60, width: 60 }}
            />
          ),
        });
        break;
      case 'info': // New case for info
        toast(message, {
          duration,
          icon: (
            <Lottie
              animationData={infoAnimation}
              loop={true}
              style={{ height: 60, width: 60 }}
            />
          ),
          style: {
            border: '1px solid #3B82F6', // Tailwind blue-500
            padding: '16px',
            color: '#2563EB', // Tailwind blue-600
          },
        });
        break;
      case 'loading':
        toast.loading(message, {
          duration,
        });
        break;
      default:
        toast(message, {
          duration,
          icon: (
            <Lottie
              animationData={iconAnimation}
              loop={true}
              style={{ height: 60, width: 60 }}
            />
          ),
        });
    }
  };

  return { showToast };
};

export default useCustomToast;