import axiosInstance from "../utils/axiosConfig";
import toast from "react-hot-toast";

export const useRegister = () => {
  const register = async (name, email, password, pic) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      if (pic) formData.append('pic', pic);

      const { data } = await toast.promise(
        axiosInstance.post(`/api/auth/register`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
        {
          loading: 'Registering...',
          success: (response) => response.data.message || 'Registration successful!',
          error: (err) => err.response?.data?.message || 'Registration failed. Please try again.',
        }
      );

      if (!data.success) {
        toast.error(data.message || "Registration failed. Please try again.");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({ type: "LOGIN", payload: data.user });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return { register };
};
