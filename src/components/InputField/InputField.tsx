import React, { ChangeEvent } from "react";

type InputProps = {
  type?: "text" | "email" | "password" | "number" | "file";
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  name: string;
};

const InputField: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className,
  name,
}) => {
  return (
    <div className={`p-2 mt-2 bg-[#D7CFCF80] dark:bg-gray-800 rounded-lg border bg-white border-gray-300 ${className}`}>
      <input
        className="outline-none ps-2 text-sm w-full dark:bg-gray-800"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  );
};

export default InputField;
