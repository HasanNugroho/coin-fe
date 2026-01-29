import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

let accessToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    accessToken = token;
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const getAuthToken = () => accessToken;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            return api(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default api;
