import axios from "axios";

const API_URL =
    "http://localhost:3000/api/products";

export const getProducts = async (params = {}) => {
    try {
        const response = await axios.get(API_URL, { params });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/categories");
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};