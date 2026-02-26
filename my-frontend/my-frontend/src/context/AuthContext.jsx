// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// const API_BASE = "http://localhost:8000/api";

// export const AuthProvider = ({ children }) => {
//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedDoctor = localStorage.getItem("doctor");
//     const token = localStorage.getItem("token");

//     if (storedDoctor && token) {
//       setDoctor(JSON.parse(storedDoctor));
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     }

//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     const response = await axios.post(`${API_BASE}/auth/login`, {
//       email,
//       password,
//     });

//     const { token, doctor } = response.data;

//     localStorage.setItem("token", token);
//     localStorage.setItem("doctor", JSON.stringify(doctor));

//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//     setDoctor(doctor);
//   };

//   const signup = async (name, email, password) => {
//     await axios.post(`${API_BASE}/auth/signup`, {
//       name,
//       email,
//       password,
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("doctor");
//     delete axios.defaults.headers.common["Authorization"];
//     setDoctor(null);
//   };

//   return (
//     <AuthContext.Provider value={{ doctor, login, signup, logout, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };




// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [doctor, setDoctor] = useState(
//     JSON.parse(localStorage.getItem("doctor")) || null
//   );
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   // Axios instance with token
//   const api = axios.create({
//     baseURL: "http://localhost:8000/api/auth",
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   });

//   useEffect(() => {
//     if (doctor && token) {
//       localStorage.setItem("doctor", JSON.stringify(doctor));
//       localStorage.setItem("token", token);
//     } else {
//       localStorage.removeItem("doctor");
//       localStorage.removeItem("token");
//     }
//   }, [doctor, token]);

//   const signup = async (form) => {
//     const res = await api.post("/signup", form);
//     return res.data;
//   };

//   const login = async (email, password) => {
//     const res = await api.post("/login", { email, password });
//     setToken(res.data.token);
//     setDoctor(res.data.doctor);
//   };

//   const logout = () => {
//     setDoctor(null);
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ doctor, token, signup, login, logout, api }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);






// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [doctor, setDoctor] = useState(
//     JSON.parse(localStorage.getItem("doctor")) || null
//   );
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   // Persist doctor and token to localStorage
//   useEffect(() => {
//     if (doctor && token) {
//       localStorage.setItem("doctor", JSON.stringify(doctor));
//       localStorage.setItem("token", token);
//     } else {
//       localStorage.removeItem("doctor");
//       localStorage.removeItem("token");
//     }
//   }, [doctor, token]);

//   const signup = async (form) => {
//     const res = await axios.post("http://localhost:8000/api/auth/signup", form);
//     return res.data;
//   };

//   const login = async (email, password) => {
//     const res = await axios.post("http://localhost:8000/api/auth/login", {
//       email,
//       password,
//     });
//     setToken(res.data.token);
//     setDoctor(res.data.doctor);
//   };

//   const logout = () => {
//     setDoctor(null);
//     setToken(null);
//   };

//   // Axios instance for protected routes
//   const api = axios.create({
//     baseURL: "http://localhost:8000/api",
//   });

//   // Add Authorization header dynamically
//   api.interceptors.request.use(
//     (config) => {
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   return (
//     <AuthContext.Provider value={{ doctor, token, signup, login, logout, api }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);






import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_CENTRAL_API_GATEWAY_URL 
  ? `${process.env.REACT_APP_CENTRAL_API_GATEWAY_URL}/api/medical-rag/api`
  : 'http://localhost:8080/api/medical-rag/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); 

  const [doctor, setDoctor] = useState(
    JSON.parse(localStorage.getItem("doctor")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Persist doctor and token to localStorage
  useEffect(() => {
    if (doctor && token) {
      localStorage.setItem("doctor", JSON.stringify(doctor));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("doctor");
      localStorage.removeItem("token");
    }
  }, [doctor, token]);

  const signup = async (form) => {
    const res = await axios.post(`${baseURL}/auth/signup`, form);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${baseURL}/auth/login`, {
      email,
      password,
    });
    setToken(res.data.token);
    setDoctor(res.data.doctor);
  };

  const logout = () => {
    setDoctor(null);
    setToken(null);

    localStorage.removeItem("doctor");
    localStorage.removeItem("token");

    navigate("/login", { replace: true });
  };

  // Axios instance for protected routes
  const api = axios.create({
    baseURL,
  });

  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return (
    <AuthContext.Provider value={{ doctor, token, signup, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);