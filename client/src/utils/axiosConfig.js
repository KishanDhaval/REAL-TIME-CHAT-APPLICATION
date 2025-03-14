import axios from "axios";
export const basePicUrl = "https://real-time-chat-application-4s2c.onrender.com/images"
// Create a custom axios instance
const axiosInstance = axios.create({
  baseURL: 'https://real-time-chat-application-4s2c.onrender.com', // Ensure this is set correctly
});

// Add a request interceptor to set the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")); // Assuming you're storing the token in localStorage

    if (user?.token) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
