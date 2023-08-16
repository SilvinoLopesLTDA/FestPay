import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/worker`;

// Register Worker
const registerWorker = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(`${API_URL}/register`, formData, config);
  return response.data;
};

// Get all Workers
const getWorkers = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Get a Worker
const getWorker = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Delete Worker
const deleteWorker = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Update Worker
const updateWorker = async (id, formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.patch(
    `${API_URL}/updateworker/${id}`,
    formData,
    config
  );
  return response.data;
};

const workerService = {
  registerWorker,
  getWorkers,
  getWorker,
  deleteWorker,
  updateWorker,
};

export default workerService;
