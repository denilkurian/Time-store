import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInputs {
  title: string;
  business_entity: string;
  address: string;
  state: string;
  district: string;
}

const useFormValidation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>({
    mode: "onSubmit", // Trigger validation on submit
  });

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    console.log("Form Data Submitted", data);
    // Handle form submission
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    reset,
  };
};

export default useFormValidation;
