import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:5000/api/v1/",
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
      return Promise.reject({ message: "Network Error. Please check your connection." });
    } else {
      console.error("Error:", error.message);
      return Promise.reject({ message: "An unexpected error occurred." });
    }
  }
);

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const profile = () => http.get("/users/me");
const register = (user) => http.post("/users", user);
const login = (user) => http.post("/sessions", user);
const getPrototype = (id) => http.get(`/prototypes/${encodeURIComponent(id)}`);
const getPrototypes = () => http.get("/prototypes");
const deletePrototype = (id) => http.delete(`/prototypes/${encodeURIComponent(id)}`);
const uploadCapture = (formData) =>
  http.post("/captures", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export { login, getPrototype, deletePrototype, register, profile, getPrototypes, uploadCapture };