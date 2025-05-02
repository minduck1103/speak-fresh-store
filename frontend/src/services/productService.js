import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api/v1';

const getProducts = async (params = {}) => {
    const response = await axios.get(`${API_URL}/products`, { params });
    return response.data;
};

const getProduct = async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
};

const createProduct = async (productData) => {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
};

const updateProduct = async (id, productData) => {
    const response = await axios.put(`${API_URL}/products/${id}`, productData);
    return response.data;
};

const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/products/${id}`);
    return response.data;
};

const uploadProductImage = async (id, formData) => {
    const response = await axios.post(`${API_URL}/products/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

const createProductFormData = async (formData) => {
    const response = await axios.post(`${API_URL}/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

const updateProductFormData = async (id, formData) => {
    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

const productService = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    createProductFormData,
    updateProductFormData
};

export default productService; 