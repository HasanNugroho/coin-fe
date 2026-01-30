import axios from 'axios';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const apiTimeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10);

const api = axios.create({
    baseURL: apiBaseURL,
    timeout: apiTimeout,
});

let accessToken: string | null = null;
let refreshToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: string) => void;
    reject: (reason?: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

export const setAuthToken = (token: string | null) => {
    accessToken = token;
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const setRefreshToken = (token: string | null) => {
    refreshToken = token;
};

export const getAuthToken = () => accessToken;
export const getRefreshToken = () => refreshToken;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            if (!refreshToken) {
                isRefreshing = false;
                processQueue(new Error('No refresh token available'), null);
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${apiBaseURL}/v1/auth/refresh-token`,
                    { refresh_token: refreshToken },
                    { timeout: apiTimeout }
                );

                const newAccessToken = response.data.data.access_token;
                setAuthToken(newAccessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);
                isRefreshing = false;
                return api(originalRequest);
            } catch (err) {
                const refreshError = err instanceof Error ? err : new Error('Token refresh failed');
                processQueue(refreshError, null);
                isRefreshing = false;
                setAuthToken(null);
                setRefreshToken(null);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export { api };
export default api;
