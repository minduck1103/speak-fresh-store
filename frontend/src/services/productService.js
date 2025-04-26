import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

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

const uploadProductImage = async (id, imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);
    
    const response = await axios.put(`${API_URL}/products/${id}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

const productService = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
};

export default productService; 