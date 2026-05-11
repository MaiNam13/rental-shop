import axiosClient from './axiosClient';

const cartApi = {
    getCart: () => axiosClient.get('/cart'),
    addToCart: (data) => axiosClient.post('/cart', data),
    updateItem: (id, data) => axiosClient.put(`/cart/${id}`, data),
    removeItem: (id) => axiosClient.delete(`/cart/${id}`),
    clearCart: () => axiosClient.delete('/cart'),
    getSummary: () => axiosClient.get('/cart/summary'),
    checkout: (data) => axiosClient.post('/rentals', data)
};

export default cartApi;
