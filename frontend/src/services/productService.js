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
    console.log('DEBUG uploadProductImage - formData:', formData.get('image'));
    const response = await axios.put(`${API_URL}/products/${id}/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    console.log('DEBUG uploadProductImage - response:', response.data);
    return response.data;
};

const createProductFormData = async (formData) => {
    const response = await axios.post(`${API_URL}/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

const updateProductFormData = async (id, formData) => {
    console.log('DEBUG updateProductFormData - formData entries:');
    for (let [key, value] of formData.entries()) {
        console.log(key, ':', value);
    }
    
    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
        headers: { 
            'Content-Type': 'multipart/form-data'
        }
    });
    console.log('DEBUG updateProductFormData - response:', response.data);
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