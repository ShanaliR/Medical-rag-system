import axios from 'axios';

// Create axios instance with base configuration
const baseURL = process.env.REACT_APP_CENTRAL_API_GATEWAY_URL 
  ? `${process.env.REACT_APP_CENTRAL_API_GATEWAY_URL}/api/medical-rag/api`
  : 'http://localhost:8080/api/medical-rag/api';

const API = axios.create({
    baseURL,
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor for logging and auth (if needed)
API.interceptors.request.use(
    (config) => {
        // Log request for debugging
        if (process.env.NODE_ENV === 'development') {
            console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Response Error:', error);
        
        let errorMessage = 'An unexpected error occurred';
        
        if (error.response) {
            // Server responded with error status
            errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Server error: ${error.response.status}`;
        } else if (error.request) {
            // Request made but no response
            errorMessage = 'No response from server. Please check your connection.';
        } else {
            // Something else happened
            errorMessage = error.message;
        }
        
        // You could show a toast notification here
        // For now, we'll reject with a standardized error
        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data
        });
    }
);

export default API;