import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:3000/api",
});

// Thêm interceptor để tự động gắn token vào header x-access-token
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;