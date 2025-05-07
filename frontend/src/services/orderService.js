import { axiosInstance } from './authService';

export const createOrder = async (orderData) => {
  const response = await axiosInstance.post('/orders', orderData, { withCredentials: true });
  return response.data;
};

export const getOrders = async () => {
  return axiosInstance.get('/orders');
};

export const getMyOrders = async () => {
  const response = await axiosInstance.get('/orders/myorders', { withCredentials: true });
  return response.data;
};

export const deleteOrder = async (orderId) => {
  return axiosInstance.delete(`/orders/${orderId}`, { withCredentials: true });
}; 