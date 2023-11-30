import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/clients`;
const API_URL_QR = `${BACKEND_URL}/api/qrCode`;

const createClient = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post(`${API_URL}/register`, formData, config);
  return response;
};

const getClients = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

const deleteClient = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const getClient = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const getClientInfo = async (id) => {
  const response = await axios.get(`${API_URL}/client-info/${id}`);
  return response.data;
};

const updateClient = async (id, formData) => {
  const response = await axios.patch(`${API_URL}/${id}`, formData);
  return response.data;
};

const rechargeClient = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(`${API_URL_QR}/recharge`, formData, config);
  return response.data;
};

const clientService = {
  createClient,
  getClients,
  deleteClient,
  getClient,
  getClientInfo,
  updateClient,
  rechargeClient,
};

export default clientService;
