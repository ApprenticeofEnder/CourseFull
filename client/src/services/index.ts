import axios from 'axios';

const baseURL =
    process.env.NODE_ENV === 'production'
        ? '/'
        : 'http://localhost:8080';

const DEBUG = process.env.NODE_ENV === "development";

const api = axios.create({
    baseURL,
    headers: {
        Accept: 'application/json',
    },
});

api.interceptors.request.use(
    function (config) {
        if (DEBUG) { console.info("✉️ ", config); }
        return config;
    },
    function (error) {
        if (DEBUG) { console.error("✉️ ", error); }
        if (error.response.status === 401) {
            window.location.href = '/';
        }

        return Promise.reject(error);
    }
);

export { api };