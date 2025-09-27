import React, { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Event type added
  type?: 'primary' | 'success' | 'warning' | 'delete' | 'info' | 'normal' | 'transparent';
  variant?: 'primary' | 'secondary' | 'danger';
  Buttonclass?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  onClick,
  type = 'normal',
  Buttonclass,
  disabled
}) => {
  const baseStyles = 'flex items-center justify-center py-2 px-6 w-[120px] h-[45px] rounded-lg shadow-md hover:bg-[#6d49d6]';

  const buttonStyles: Record<string, string> = {
    primary: 'bg-[#7A5BF5] hover:bg-[#6d49d6] text-white',
    success: 'bg-[#379E4D] hover:bg-green-500 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-black',
    delete: 'bg-[#F40A0A] hover:bg-red-600 text-white',
    info: 'bg-teal-500 hover:bg-teal-600 text-white',
    normal: 'bg-white hover:bg-gray-300 text-black',
    transparent: 'bg-transparent border hover:bg-[#E5E7EB] text-[#6056E6]',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${buttonStyles[type]} ${Buttonclass}`}
      disabled={disabled}
    >
      {children}
      {icon && <span className="mr-2">{icon}</span>}
    </button>
  );
};

export default Button;
