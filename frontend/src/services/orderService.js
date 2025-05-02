import { axiosInstance } from './authService';

export const createOrder = async (orderData) => {
  const response = await axiosInstance.post(`/api/v1/orders`, orderData, { withCredentials: true });
  return response.data;
};

export const getOrders = async () => {
  const response = await axiosInstance.get(`/api/v1/orders`, { withCredentials: true });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axiosInstance.get(`/api/v1/orders/myorders`, { withCredentials: true });
  return response.data;
};

export const deleteOrder = async (orderId) => {
  return axiosInstance.delete(`/api/v1/orders/${orderId}`, { withCredentials: true });
}; 