import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../../pages/client/Client.module.scss";
import { useDispatch } from "react-redux";
import { getAdmins } from "../../../redux/features/Admin/Actions/AdminSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import PassStyle from "./FormAdmin.module.scss";
import * as Components from "../../../pages/manage/addAdmin/Components";
// import { toast } from "react-toastify";

const FormAdmin = ({ admin, saveAdmin, handleInputChange, required }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, setIsSubmitted] = useState(false); 
  const [visible, setVisible] = useState(true);

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value.replace(/\D/g, "");
    filteredValue = filteredValue.substring(0, 6);
    handleInputChange({ target: { name, value: filteredValue } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (admin.name && admin.email && admin.password) {
      saveAdmin(admin);
      navigate("/manage");
      dispatch(getAdmins());
    } else {
      navigate("/add-admin");
    }
  };

  const saveAdminData = () => {
    const adminData = {
      ...admin,
    };
    saveAdmin(JSON.stringify(adminData));
  };

  return (
    <div className="mt-4 w-full">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className={styles.input}>
          <label htmlFor="name" className="flex justify-start my-3">
            Nome <span className="text-red-600 mx-2">{required}</span>
          </label>
          <div className="flex">
            <input
              type="text"
              placeholder="Matheus..."
              name="name"
              id="name"
              value={admin?.name}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
        </div>
        <div className={styles.input}>
          <label htmlFor="email" className="flex justify-start my-3">
            Email <span className="text-red-600 mx-2">{required}</span>
          </label>
          <div className="flex">
            <input
              type="email"
              placeholder="email@gmail.com"
              name="email"
              id="email"
              value={admin?.email}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
        </div>
        <div className={styles.input}>
          <label htmlFor="password" className="flex justify-start my-3">
            Senha <span className="text-red-600 mx-2">{required}</span>
          </label>
          <div className="flex">
            <input
              type={visible ? "text" : "password"}
              placeholder={visible ? "123456" : "******"}
              required
              id="password"
              name="password"
              value={admin?.password}
              onChange={handlePwdChange}
              className="w-full"
            />
            <div
              className={PassStyle.toggleVisible}
              onClick={() => setVisible(!visible)}
            >
              {visible ? (
                <AiOutlineEye color="#0f172a" />
              ) : (
                <AiOutlineEyeInvisible color="#0f172a" />
              )}
            </div>
          </div>
        </div>
        <Components.Button onClick={saveAdminData}>Salvar</Components.Button>
      </form>
    </div>
  );
};

FormAdmin.propTypes = {
  admin: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleInputChange: PropTypes.func,
  saveAdmin: PropTypes.func,
  required: PropTypes.string,
};

export default FormAdmin;
