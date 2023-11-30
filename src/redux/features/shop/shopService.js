import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/shops`;
const API_URL_QR = `${BACKEND_URL}/api/qrCode`;

const createShop = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(`${API_URL}/create-shop`, formData, config);
  return response.data;
};

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

const getShops = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

const deleteShop = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const deleteItem = async (id) => {
  const response = await axios.delete(`${API_URL}/delete-item/${id}`);
  return response.data;
};

const getShop = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const updateShop = async (id, formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.patch(`${API_URL}/${id}`, formData, config);
  return response.data;
};

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

const getPurchases = async () => {
  const response = await axios.get(`${API_URL}/get-purchases`);
  return response.data;
};

const addWorker = async (id, workers) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(
    `${API_URL}/${id}/assign-workers`,
    { workers },
    config
  );
  return response.data;
};

const removeWorker = async (id, workers) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(
    `${API_URL}/${id}/remove-workers`,
    workers,
    config
  );
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
  addWorker,
  removeWorker,
};

export default shopService;
