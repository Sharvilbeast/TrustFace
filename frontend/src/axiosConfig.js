import axios from 'axios';

// Set the base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:8000';

// Add a request interceptor for debugging
axios.interceptors.request.use(
  config => {
    console.log('Request being sent:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging
axios.interceptors.response.use(
  response => {
    console.log('Response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('Response error:', error.response ? {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    } : error.message);
    return Promise.reject(error);
  }
);

export default axios;