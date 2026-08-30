import axios from 'axios';

// Create a centralized Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response Interceptor for Graceful Error Handling (Phase 3)
api.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        
        // 1. Handle 401 Unauthorized (Expired/Invalid Token) globally
        if (error.response && error.response.status === 401) {
            console.warn('Session expired or invalid. Redirecting to login...');
            // Clear local storage completely
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirect outside of React Router context to ensure clean state wipe
            // Only redirect if we are not already on the login page to prevent redirect loops
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        // 2. Handle 500+ generic server errors globally
        if (error.response && error.response.status >= 500) {
            console.error('Server encountered a critical error.');
            // Inject a generic fallback message if the backend didn't provide one
            if (!error.response.data) error.response.data = {};
            if (!error.response.data.message) {
                error.response.data.message = 'The server is temporarily down. Please try again later.';
            }
        }

        // Always reject the promise so individual stores can still catch it
        return Promise.reject(error);
    }
);

export default api;
