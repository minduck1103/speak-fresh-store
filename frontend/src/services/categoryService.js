import api from './api';

const getCategories = async () => {
    const response = await api.get('/api/v1/categories');
    return response.data;
};

const getCategory = async (id) => {
    const response = await api.get(`/api/v1/categories/${id}`);
    return response.data;
};

const createCategory = async (categoryData) => {
    const response = await api.post('/api/v1/categories', categoryData);
    return response.data;
};

const updateCategory = async (id, categoryData) => {
    const response = await api.put(`/api/v1/categories/${id}`, categoryData);
    return response.data;
};

const deleteCategory = async (id) => {
    const response = await api.delete(`/api/v1/categories/${id}`);
    return response.data;
};

const categoryService = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};

export default categoryService; 