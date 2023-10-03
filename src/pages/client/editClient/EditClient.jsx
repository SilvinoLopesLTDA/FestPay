import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClient,
  getClients,
  selectClient,
  selectIsLoading,
  updateClient,
} from "../../../redux/features/client/clientSlice";
import styles from "../../client/Client.module.scss";
import Loader from "../../../components/loader/Loader";

const EditClient = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const editClient = useSelector(selectClient);
  const [clients, setClients] = useState({});

  useEffect(() => {
    dispatch(getClient(id));
  }, [dispatch, id]);

  useEffect(() => {
    setClients(editClient);
  }, [editClient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClients({ ...clients, [name]: value });
  };

  const saveEditItem = async () => {
    const formData = {
      name: clients.name,
      phone: clients.phone,
    };
    const updateData = {
      id: id,
      formData: formData,
    };
    await dispatch(updateClient(updateData));
    await dispatch(getClients());
    navigate("/clients");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    saveEditItem(clients);
  };

  const handleReturn = async () => {
    await dispatch(getClients());
    navigate("/clients");
  };

  return (
    <div className="flex justify-center items-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold">
            Editar
            <span className="text-violet-600 font-bold"> Cliente</span>
          </h2>
          <button
            className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300"
            onClick={handleReturn}
          >
            Voltar
          </button>
        </div>
        <p className="mb-3 text-lg">- Edite os dados do cliente abaixo</p>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            placeholder="Digite o novo nome do item..."
            name="name"
            id="name"
            value={clients?.name}
            onChange={handleInputChange}
            className={
              isSubmitted && clients?.name === "" ? `${styles.highlight}` : ""
            }
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={clients?.email}
            disabled
            className="cursor-not-allowed bg-gray-300"
          />
          <label htmlFor="phone">Telefone</label>
          <input
            type="text"
            placeholder="Digite o novo número de telefone do cliente..."
            name="phone"
            id="phone"
            value={clients?.phone}
            onChange={handleInputChange}
            className={
              isSubmitted && clients?.phone === "" ? `${styles.highlight}` : ""
            }
          />
          <div className="flex">
            <button
              className="w-full py-2 bg-violet-800 rounded-sm text-lg font-semibold hover:bg-violet-700 transition-colors duration-300 mt-10"
              type="submit"
            >
              Editar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClient;
