import axiosClient from "../api/axiosClient";


// GET ALL PRODUCTS
export const getProducts = async () => {

    const response =
        await axiosClient.get("/products");

    return response.data;
};


// GET PRODUCT DETAIL
export const getProductById = async (id) => {

    const response =
        await axiosClient.get(`/products/${id}`);

    return response.data;
};


// SEARCH PRODUCTS
export const searchProducts = async (keyword) => {

    const response =
        await axiosClient.get(
            `/products?keyword=${keyword}`
        );

    return response.data;
};


// FILTER PRODUCTS BY CATEGORY
export const filterProductsByCategory = async (
    categoryId
) => {

    const response =
        await axiosClient.get(
            `/products?category=${categoryId}`
        );

    return response.data;
};


// PAGINATION PRODUCTS
export const getPaginationProducts = async (
    page,
    limit
) => {

    const response =
        await axiosClient.get(
            `/products?page=${page}&limit=${limit}`
        );

    return response.data;
};


// SORT PRODUCTS
export const sortProducts = async (sort) => {

    const response =
        await axiosClient.get(
            `/products?sort=${sort}`
        );

    return response.data;
};


// CREATE PRODUCT
export const createProduct = async (
    productData,
    token
) => {

    const response =
        await axiosClient.post(
            "/products",
            productData,
            {
                headers: {
                    "x-access-token": token,
                },
            }
        );

    return response.data;
};


// UPDATE PRODUCT
export const updateProduct = async (
    id,
    productData,
    token
) => {

    const response =
        await axiosClient.put(
            `/products/${id}`,
            productData,
            {
                headers: {
                    "x-access-token": token,
                },
            }
        );

    return response.data;
};


// DELETE PRODUCT
export const deleteProduct = async (
    id,
    token
) => {

    const response =
        await axiosClient.delete(
            `/products/${id}`,
            {
                headers: {
                    "x-access-token": token,
                },
            }
        );

    return response.data;
};