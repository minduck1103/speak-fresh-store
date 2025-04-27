import { axiosInstance } from './authService';
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

export const createOrder = async (orderData) => {
  const response = await axiosInstance.post(`/orders`, orderData, { withCredentials: true });
  return response.data;
};

export const getOrders = async () => {
  const response = await axiosInstance.get(`/orders`, { withCredentials: true });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axiosInstance.get(`/orders/myorders`, { withCredentials: true });
  return response.data;
};

export const deleteOrder = async (orderId) => {
  return axiosInstance.delete(`/orders/${orderId}`, { withCredentials: true });
}; 