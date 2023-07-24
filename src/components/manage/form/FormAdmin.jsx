import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../../pages/client/Client.module.scss";
import { useDispatch } from "react-redux";
import { getAdmins } from "../../../redux/features/Admin/Actions/AdminSlice";

const FormAdmin = ({ admin, saveAdmin, handleInputChange, required }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (admin.name && admin.email) {
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
    <div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="name">
          Nome <span className="text-red-600">{required}</span>
        </label>
        <input
          type="text"
          placeholder="Matheus..."
          name="name"
          id="name"
          value={admin?.name}
          onChange={handleInputChange}
          className={
            isSubmitted && admin?.name === "" ? `${styles.highlight}` : ""
          }
        />
        <label htmlFor="email">
          Email <span className="text-red-600">{required}</span>
        </label>
        <input
          type="email"
          placeholder="email@gmail.com"
          name="email"
          id="email"
          value={admin?.email}
          onChange={handleInputChange}
          className={
            isSubmitted && admin?.email === "" ? `${styles.highlight}` : ""
          }
        />
        <button
          type="submit"
          className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium mt-10"
          onClick={saveAdminData}
        >
          Salvar
        </button>
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
