import axiosClient from "./axiosClient";

const favoriteApi = {
    getFavorites: () => {
        return axiosClient.get("/favorites");
    },
    toggleFavorite: (productId) => {
        return axiosClient.post("/favorites/toggle", { product_id: productId });
    }
};

export default favoriteApi;
