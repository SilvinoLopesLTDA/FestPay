import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/clients`;

// Create New Client
const createClient = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post(`${API_URL}/register`, formData, config);
  return response;
};

// Get all Clients
const getClients = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Delete a Client
const deleteClient = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Get a Client
const getClient = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Update Client
const updateClient = async (id, formData) => {
  const response = await axios.patch(`${API_URL}/${id}`, formData);
  return response.data;
};

const clientService = {
  createClient,
  getClients,
  deleteClient,
  getClient,
  updateClient,
};

export default clientService;
