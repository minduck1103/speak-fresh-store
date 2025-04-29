import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Configure axios instance
export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const authService = {
    // Register new account
    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register', userData);
            
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'An error occurred during registration' };
        }
    },

    // Login
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Update token for subsequent requests
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Invalid credentials' };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axiosInstance.defaults.headers.common['Authorization'];
    },

    // Check if authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Get token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Get user role
    getUserRole: () => {
        const user = localStorage.getItem('user');
        if (user) {
            return JSON.parse(user).role;
        }
        return null;
    },

    // Update profile
    updateProfile: async (userData) => {
        try {
            const response = await axiosInstance.put('/auth/updatedetails', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Error updating profile' };
        }
    },

    // Update password
    updatePassword: async (passwordData) => {
        try {
            const response = await axiosInstance.put('/auth/updatepassword', passwordData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Error updating password' };
        }
    },

    // Forgot password
    forgotPassword: async (email) => {
        try {
            const response = await axiosInstance.post('/auth/forgotpassword', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error sending password reset request' };
        }
    },

    // Reset password
    resetPassword: async (resetToken, password) => {
        try {
            const response = await axiosInstance.put(`/auth/resetpassword/${resetToken}`, { password });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error resetting password' };
        }
    }
};

// Restore token from localStorage if exists
const token = localStorage.getItem('token');
if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default authService; 