import axiosClient from "./axiosClient";

const categoryApi = {
    getAll: () => {
        const url = "/categories";
        return axiosClient.get(url);
    },
    create: (data) => {
        const url = "/categories";
        return axiosClient.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    update: (id, data) => {
        const url = `/categories/${id}`;
        return axiosClient.put(url, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    delete: (id) => {
        const url = `/categories/${id}`;
        return axiosClient.delete(url);
    },
};

export default categoryApi;
