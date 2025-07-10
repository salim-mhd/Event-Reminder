import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

if (typeof window !== "undefined") {
  // ✅ Request Interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error("Request Error:", error);
      // return Promise.reject(error); // ← You must return this
    }
  );

  // ✅ Response Interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;

        // Example: Handle 401 unauthorized globally
        if (status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }

        // Example: Handle 403 Forbidden
        if (status === 403) {
          console.warn("Access denied");
        }

        // Log error data for debugging
        console.error("API Error Response:", data);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Axios error:", error.message);
      } // Always reject to allow .catch() in components
    }
  );
}

export default api;
