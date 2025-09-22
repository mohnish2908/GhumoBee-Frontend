// src/services/apiConnector.ts
import axios, { Method, AxiosRequestConfig, AxiosResponse } from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // backend base url
  withCredentials: true, // if you are using cookies
});

// --- Request Interceptor ---
// This runs BEFORE each request is sent.
// We'll use it to automatically attach the JWT to the Authorization header.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Add the token to the headers for every authenticated request
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// This runs AFTER a response is received.
// We'll use it to globally handle authentication errors.
axiosInstance.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    // Check if the error is a 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      console.error("Authentication Error: Token is invalid or expired.");

      // 1. Clear user session data
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Also clear user info if stored

      // 2. Redirect to the login page
      // Using window.location.href will cause a full page reload, clearing any in-memory state.
      window.location.href = '/login'; 
      
      // You could also use a router's programmatic navigation if you're using a framework
      // For example, in React Router: history.push('/login');
    }

    // For any other errors, just pass them along
    return Promise.reject(error);
  }
);

export const apiConnector = async <T = any>(
  method: Method,
  url: string,
  bodyData?: Record<string, any>,
  headers?: Record<string, string>,
  params?: Record<string, any>
): Promise<AxiosResponse<T>> => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data: bodyData ?? null,
    headers: headers ?? {},
    params: params ?? {},
  };

  return axiosInstance(config);
};
