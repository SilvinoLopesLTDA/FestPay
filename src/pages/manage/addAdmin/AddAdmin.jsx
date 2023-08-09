import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader";
import styles from "../../client/Client.module.scss";
import {
  getAdmins,
  registerAdmin,
  selectIsLoading,
} from "../../../redux/features/Admin/Actions/AdminSlice";
import FormAdmin from "../../../components/manage/form/FormAdmin";

const initialState = {
  name: "",
  email: "",
};

const AddAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(initialState);
  const [submittedAdmins, setSubmittedAdmins] = useState([]);

  const { name, email } = admin;

  const isLoading = useSelector(selectIsLoading);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const saveAdmin = async () => {
    event.preventDefault();
    const formData = {
      name: name,
      email: email,
    };
    console.log(formData);
    await dispatch(registerAdmin(formData));

    if (admin.name && admin.email) {
      const newAdmin = { ...admin };
      setSubmittedAdmins([...submittedAdmins, newAdmin]);
      setAdmin(initialState);
      dispatch(getAdmins());
      navigate("/manage");
    }
  };

  return (
    <div className="flex justify-center items-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between mb-3">
          <h2 className="text-2xl font-semibold">
            Registre um{" "}
            <span className="text-violet-700 font-bold">Administrador</span>
          </h2>
          <Link to="/manage">
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg medium">
              {" "}
              Voltar
            </button>
          </Link>
        </div>
        <p className="mb-3 text-lg">
          - Adicione os dados do Administrador abaixo
        </p>
        <FormAdmin
          admin={admin}
          saveAdmin={saveAdmin}
          handleInputChange={handleInputChange}
          required={"*"}
        />
      </div>
    </div>
  );
};

AddAdmin.propTypes = {
  admin: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleInputChange: PropTypes.func,
  saveAdmin: PropTypes.func,
};

export default AddAdmin;
