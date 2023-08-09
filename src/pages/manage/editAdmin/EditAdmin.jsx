import { useParams } from "react-router-dom";
import styles from "../../client/Client.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../../../components/loader/Loader";
import {
  getAdmin,
  getAdmins,
  selectAdmin,
  selectIsLoading,
  updateAdmin,
} from "../../../redux/features/Admin/Actions/AdminSlice";
import { useEffect } from "react";

const EditAdmin = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const editAdmin = useSelector(selectAdmin);

  const [admin, setAdmin] = useState({});

  useEffect(() => {
    dispatch(getAdmin(id));
  }, [dispatch, id]);

  useEffect(() => {
    setAdmin(editAdmin);
  }, [editAdmin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const saveEditAdmin = async () => {
    const formData = {
      name: admin.name,
      email: admin.email,
    };
    const updateData = {
      id: id,
      formData: formData,
    };
    await dispatch(updateAdmin(updateData));
    await dispatch(getAdmins());
    navigate("/manage");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (admin.name && admin.email) {
      saveEditAdmin(admin);
    } else {
      navigate(`/edit-admin/${id}`);
    }
  };

  const handleReturn = async () => {
    await dispatch(getAdmins());
    navigate("/manage");
  };

  return (
    <div className="flex justify-center itemss-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between mb-3">
          <h2 className="text-2xl font-semibold">
            Editar
            <span className="text-violet-700 font-bold"> Administrador</span>
          </h2>
          <button
            className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium"
            onClick={handleReturn}
          >
            Voltar
          </button>
        </div>
        <p className="mb-3 text-lg">- Edite os dados do Administrador abaixo</p>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="email@gmail.com"
            name="email"
            id="email"
            disabled
            value={admin?.email}
            onChange={handleInputChange}
            className={
              isSubmitted && admin?.email === "" ? `${styles.highlight}` : ""
            }
          />
          <label htmlFor="name">Nome</label>
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
          <div className="flex">
            <button
              className="px-5 py-2 bg-violet-800 rounded-sm text-lg font-semibold mt-10"
              type="submit"
            >
              Editar Administrador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdmin;
