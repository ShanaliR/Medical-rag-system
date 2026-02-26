// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api",
// });

// // Attach token automatically
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


import axios from "axios";

const baseURL = process.env.REACT_APP_CENTRAL_API_GATEWAY_URL 
  ? `${process.env.REACT_APP_CENTRAL_API_GATEWAY_URL}/api/medical-rag/api`
  : 'http://localhost:8080/api/medical-rag/api';

const authAxios = axios.create({
  baseURL,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authAxios;