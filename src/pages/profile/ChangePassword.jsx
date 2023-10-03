import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { changePassword } from "../../redux/features/auth/authService";
import { toast } from "react-toastify";

const ChangePassword = ({ handleCloseChangePassword }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const { oldPassword, newPassword, confirmNewPassword } = formData;

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [newPasswordVisibility, setNewPasswordVisibility] = useState(false);
  const [confirmNewPasswordVisibility, setConfirmNewPasswordVisibility] =
    useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      return toast.error("As novas senhas não coincidem");
    }

    try {
      const data = await changePassword(formData);
      toast.success(data);
      navigate("/edit-profile");
      handleCloseChangePassword();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-full flex justify-center items-center bg-black/60">
      <div className="bg-slate-800 py-4 px-6 rounded w-5/12 sm:w-11/12">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl text-white">Altere sua Senha</h3>
          <button
            onClick={handleCloseChangePassword}
            className="rounded hover:bg-black/40 p-2"
          >
            <AiOutlineClose size={30} color="#94a3b8" />
          </button>
        </div>
        <div className="flex items-center justify-center">
          <hr className="my-3 w-full border-indigo-500/80" />
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="oldPassword" className="text-white">
              Senha Antiga:
            </label>
            <div className="relative">
              <input
                type={passwordVisibility ? "text" : "password"}
                placeholder="Digite sua antiga senha..."
                name="oldPassword"
                id="oldPassword"
                value={oldPassword}
                onChange={handleInputChange}
                className="bg-gray-100 text-black px-4 py-2 rounded-md w-full"
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setPasswordVisibility(!passwordVisibility)}
              >
                {passwordVisibility ? (
                  <AiOutlineEye color="#000" size={25} />
                ) : (
                  <AiOutlineEyeInvisible color="#000" size={25} />
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-white">
              Nova Senha:
            </label>
            <div className="relative">
              <input
                type={newPasswordVisibility ? "text" : "password"}
                placeholder="Digite sua nova senha..."
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={handleInputChange}
                className="bg-gray-100 text-black px-4 py-2 rounded-md w-full"
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setNewPasswordVisibility(!newPasswordVisibility)}
              >
                {newPasswordVisibility ? (
                  <AiOutlineEye color="#000" size={25} />
                ) : (
                  <AiOutlineEyeInvisible color="#000" size={25} />
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmNewPassword" className="text-white">
              Confirme a Nova Senha:
            </label>
            <div className="relative">
              <input
                type={confirmNewPasswordVisibility ? "text" : "password"}
                placeholder="Confirme sua nova senha..."
                name="confirmNewPassword"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={handleInputChange}
                className="bg-gray-100 text-black px-4 py-2 rounded-md w-full"
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() =>
                  setConfirmNewPasswordVisibility(!confirmNewPasswordVisibility)
                }
              >
                {confirmNewPasswordVisibility ? (
                  <AiOutlineEye color="#000" size={25} />
                ) : (
                  <AiOutlineEyeInvisible color="#000" size={25} />
                )}
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-7 py-2 text-md font-semibold rounded bg-violet-800 hover:bg-violet-700 transition-colors duration-300"
            >
              Alterar Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ChangePassword.propTypes = {
  handleCloseChangePassword: PropTypes.func,
};

export default ChangePassword;
