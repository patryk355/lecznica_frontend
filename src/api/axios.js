import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;

export const getErrorMessage = (error) => {
    return Object.values(error.response.data.error)[0];
};
