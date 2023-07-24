import axios from "axios";
import { toast } from "react-toastify";

export const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

//Register Admin
export const registerAdmin = async (adminData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/admin/register`,
      adminData,
      { withCredentials: true }
    );
    if (response.statusText === "OK") {
      toast.success("Administrador Cadastrado com sucesso!");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//login Admin
export const loginAdmin = async (adminData, id) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/admin/login/${id}`,
      adminData
    );
    if (response.statusText === "OK") {
      toast.success("Administrador Logado com sucesso!");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//Logout Admin
export const LogoutAdmin = async (adminData) => {
  try {
    await axios.get(`${BACKEND_URL}/api/admin/logout`, adminData);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//Forgot Password
export const forgotPassword = async (adminData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/admin/forgotpassword`,
      adminData
    );
    toast.success(response.data.message);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//Reset Password
export const resetPassword = async (adminData, resetToken) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/admin/resetpassword/${resetToken}`,
      adminData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//get Login Status
export const getLoginStatus = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/admin/loggedin`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//get Admin profile
export const getAdmin = async (id) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/admin/${id}`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//update Admin profile
export const updateAdmin = async (formData, id) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/api/admin/updateadmin/${id}`,
      formData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//Change Password
export const changePassword = async (formData, id) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/api/admin/changepassword/${id}`,
      formData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};
