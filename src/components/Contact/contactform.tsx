import React, { useRef, useState, FormEvent } from "react";

interface ValidationErrors {
  name: string;
  email: string;
  phone: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [responseMessage, setResponseMessage] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: "",
    email: "",
    phone: "",
  });

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {
      name: "",
      email: "",
      phone: "",
    };

    if (nameRef.current && nameRef.current.value.length <= 1) {
      errors.name = "Name must be more than 1 character.";
    }

    if (emailRef.current && !emailRef.current.value.includes("@")) {
      errors.email = "Email must contain '@'.";
    }

    if (
      phoneRef.current &&
      (phoneRef.current.value.length !== 10 || isNaN(Number(phoneRef.current.value)))
    ) {
      errors.phone = "Phone must be exactly 10 digits.";
    }

    setValidationErrors(errors);

    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const formData: FormData = {
      name: nameRef.current ? nameRef.current.value : "",
      email: emailRef.current ? emailRef.current.value : "",
      phone: phoneRef.current ? phoneRef.current.value : "",
      message: messageRef.current ? messageRef.current.value : "",
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const apiResponse = await response.json();
        setResponseMessage(apiResponse.success || "Message sent successfully!");
        if (nameRef.current) nameRef.current.value = "";
        if (emailRef.current) emailRef.current.value = "";
        if (phoneRef.current) phoneRef.current.value = "";
        if (messageRef.current) messageRef.current.value = "";
      } else {
        setResponseMessage("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            ref={nameRef}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {validationErrors.name && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            ref={emailRef}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            ref={phoneRef}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {validationErrors.phone && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            ref={messageRef}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </form>

      {responseMessage && (
        <div className="mt-4 text-center text-sm">
          <p>{responseMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
