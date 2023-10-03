import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../../pages/client/Client.module.scss";
import { useDispatch } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import PassStyle from "./FormAdmin.module.scss";
import {
  getSubaccounts,
  registerSubaccount,
} from "../../../redux/features/auth/authSlice";

const FormAdmin = ({
  admin: initialAdmin,
  saveAdmin,
  handleInputChange,
  required,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, setIsSubmitted] = useState(false); 
  const [visible, setVisible] = useState(true);
  const [admin, setAdmin] = useState(initialAdmin);
  console.log(saveAdmin);
  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value.replace(/\D/g, "");
    filteredValue = filteredValue.substring(0, 6);
    handleInputChange({ target: { name, value: filteredValue } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (admin.name && admin.email && admin.password) {
      saveAdmin(admin);
      await dispatch(registerSubaccount(admin));
      navigate("/manage");
      dispatch(getSubaccounts());
    } else {
      navigate("/add-subaccount");
    }
  };

  return (
    <div className="mt-4 w-full">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className={styles.input}>
          <label className="flex justify-start my-3">
            Nome <span className="text-red-600 mx-2">{required}</span>
          </label>
          <div className="flex">
            <input
              type="text"
              placeholder="Matheus..."
              name="name"
              id="name"
              value={admin.name}
              onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
              className="w-full"
            />
          </div>
        </div>
        <div className={styles.input}>
          <label className="flex justify-start my-3">
            Email <span className="text-red-600 mx-2">{required}</span>
          </label>
          <div className="flex">
            <input
              type="email"
              placeholder="email@gmail.com"
              name="email"
              id="email"
              value={admin.email}
              onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
              className="w-full"
            />
          </div>
        </div>
        <div className={styles.input}>
          <label className="flex justify-start my-3">
            Senha <span className="text-red-600 mx-2">{required}</span>
          </label>
          <div className="flex">
            <input
              type={visible ? "text" : "password"}
              placeholder={visible ? "123456" : "******"}
              required
              id="password"
              name="password"
              value={admin.password}
              onChange={(e) => {
                setAdmin({ ...admin, password: e.target.value });
                handlePwdChange(e);
              }}
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
        <button
          className="flex justify-center text-lg font-medium mt-6 p-2 bg-violet-700 rounded sm:px-14 sm:w-full sm:justify-center"
          type="submit"
        >
          Salvar
        </button>
      </form>
    </div>
  );
};

FormAdmin.propTypes = {
  admin: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
  }),
  saveAdmin: PropTypes.func,
  handleInputChange: PropTypes.func,
  required: PropTypes.string,
};

export default FormAdmin;
