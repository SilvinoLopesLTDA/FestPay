import { useParams } from "react-router-dom";
import styles from "../../client/Client.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../../../components/loader/Loader";
import { useEffect } from "react";
import {
  getSubaccounts,
  getSubaccount,
  updateSubaccounts,
  selectIsLoading,
  selectSubaccount,
} from "../../../redux/features/auth/authSlice";

const EditWorker = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const editWorker = useSelector(selectSubaccount);

  const [worker, setWorker] = useState({});

  useEffect(() => {
    dispatch(getSubaccount(id));
  }, [dispatch, id]);

  useEffect(() => {
    setWorker(editWorker);
  }, [editWorker]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorker({ ...worker, [name]: value });
  };

  const saveEditWorker = async () => {
    const formData = {
      name: worker.name,
      email: worker.email,
      role: "worker",
      workerFunction: worker.workerFunction,
    };
    const updateData = {
      id: id,
      formData: formData,
    };
    dispatch(updateSubaccounts(updateData));
    dispatch(getSubaccounts());
    navigate("/manage");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (worker.name && worker.email) {
      saveEditWorker(worker);
    } else {
      navigate(`/edit-worker/${id}`);
    }
  };

  const handleReturn = async () => {
    dispatch(getSubaccounts());
    navigate("/manage");
  };

  return (
    <div className="flex justify-center itemss-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold">
            Editar
            <span className="text-violet-600 font-bold"> Trabalhador</span>
          </h2>
          <button
            className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300"
            onClick={handleReturn}
          >
            Voltar
          </button>
        </div>
        <p className="mb-3 text-lg">- Edite os dados do Operário abaixo</p>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            disabled
            value={worker?.email}
            onChange={handleInputChange}
            className={
              isSubmitted && worker?.email === "" ? `${styles.highlight}` : ""
            }
          />
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            placeholder="Digite o novo nome do usuário..."
            name="name"
            id="name"
            value={worker?.name}
            onChange={handleInputChange}
            className={
              isSubmitted && worker?.name === "" ? `${styles.highlight}` : ""
            }
          />
          <label htmlFor="workerFunction" className="flex justify-start my-3">
            Função
          </label>
          <select
            name="workerFunction"
            id="workerFunction"
            className="w-full"
            value={worker.workerFunction}
            onChange={handleInputChange}
          >
            <option value="">Selecione a Nova Função do Operário</option>
            <option value="Caixa">Caixa</option>
            <option value="Barraca">Barraca</option>
            <option value="Almoxarifado">Almoxarifado</option>
          </select>
          <div className="flex">
            <button
              className="px-5 py-2 bg-violet-800 rounded-sm text-lg font-semibold hover:bg-violet-700 transition-colors duration-300 mt-10"
              type="submit"
            >
              Editar Trabalhador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorker;
