import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/shops/`;

// Create New Shop
const createShop = async (formData) => {
  const response = await axios.post(`${API_URL}createshop`, formData);
  return response.data;
};

// Get all Shops
const getShops = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Delete a Shop
const deleteShop = async (id) => {
  const response = await axios.delete(`${API_URL + id}`);
  return response.data;
};

// Get a Shop
const getShop = async (id) => {
  const response = await axios.get(`${API_URL + id}`);
  return response.data;
};

// Update Shop
const updateShop = async (id, formData) => {
  const response = await axios.patch(`${API_URL}${id}`, formData);
  return response.data;
};

const shopService = {
  createShop,
  getShops,
  deleteShop,
  getShop,
  updateShop,
};

export default shopService;