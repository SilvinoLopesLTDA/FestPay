import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/shops`;
const API_URL_QR = `${BACKEND_URL}/api/qrCode`;

// Create New Shop
const createShop = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log(formData);
  const response = await axios.post(`${API_URL}/create-shop`, formData, config);
  return response.data;
};

// Create New Item
const createItem = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const id = formData.id;
  const response = await axios.post(
    `${API_URL}/create-item/${id}`,
    formData,
    config
  );
  return response.data;
};

// Get all Shops
const getShops = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Delete a Shop
const deleteShop = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Delete a Shop
const deleteItem = async (id) => {
  const response = await axios.delete(`${API_URL}/delete-item/${id}`);
  return response.data;
};

// Get a Shop
const getShop = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Update Shop
const updateShop = async (id, formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.patch(`${API_URL}/${id}`, formData, config);
  return response.data;
};

// Update  Item
const updateItem = async (shopId, itemId, formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.patch(
    `${API_URL}/update-item/${shopId}/${itemId}`,
    formData,
    config
  );
  return response.data;
};

// Purchase  Item
const purchaseItem = async (shopId, cartData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(
    `${API_URL}/buy-item/${shopId}`,
    cartData,
    config
  );
  return response.data;
};

const purchaseQRCode = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(`${API_URL_QR}/purchase`, formData, config);
  return response.data;
};

const registerPurchase = async (id, cart) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(`${API_URL}/purchase/${id}`, cart, config);
  return response.data;
};

// Get all Purchases
const getPurchases = async () => {
  const response = await axios.get(`${API_URL}/get-purchases`);
  return response.data;
};

const shopService = {
  createShop,
  createItem,
  getShops,
  deleteShop,
  deleteItem,
  getShop,
  updateShop,
  updateItem,
  purchaseItem,
  purchaseQRCode,
  registerPurchase,
  getPurchases,
};

export default shopService;
