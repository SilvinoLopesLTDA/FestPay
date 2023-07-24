import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/admin`;

// Register Admin
const registerAdmin = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log(formData);
  const response = await axios.post(`${API_URL}/register`, formData, config);
  return response.data;
};

// Get all Admins
const getAdmins = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Get a Admin
const getAdmin = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Delete Admin
const deleteAdmin = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Update Admin
const updateAdmin = async (id, formData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.patch(
    `${API_URL}/updateadmin/${id}`,
    formData,
    config
  );
  return response.data;
};

const shopService = {
  registerAdmin,
  getAdmins,
  getAdmin,
  deleteAdmin,
  updateAdmin,
};

export default shopService;
