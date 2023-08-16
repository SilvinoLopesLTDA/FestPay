import { useParams } from "react-router-dom";
import styles from "../../client/Client.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../../../components/loader/Loader";
import { useEffect } from "react";
import {
  getWorker,
  getWorkers,
  selectIsLoadingWorker,
  selectWorker,
  updateWorker,
} from "../../../redux/features/Worker/Actions/workerSlice";

const EditWorker = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoadingWorker);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const editWorker = useSelector(selectWorker);

  const [worker, setWorker] = useState({});

  useEffect(() => {
    dispatch(getWorker(id));
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
      func: worker.func
    };
    const updateData = {
      id: id,
      formData: formData,
    };
    await dispatch(updateWorker(updateData));
    await dispatch(getWorkers());
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
    await dispatch(getWorkers());
    navigate("/manage");
  };

  return (
    <div className="flex justify-center itemss-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between mb-3">
          <h2 className="text-2xl font-semibold">
            Editar
            <span className="text-violet-700 font-bold"> Operário</span>
          </h2>
          <button
            className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium"
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
            placeholder="email@gmail.com"
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
            placeholder="Matheus..."
            name="name"
            id="name"
            value={worker?.name}
            onChange={handleInputChange}
            className={
              isSubmitted && worker?.name === "" ? `${styles.highlight}` : ""
            }
          />
          <label htmlFor="func" className="flex justify-start my-3">
            Função
          </label>
          <select
            name="func"
            id="func"
            className="w-full"
            value={worker.func}
            onChange={handleInputChange}
          >
            <option value="">Selecione a Nova Função do Operário</option>
            <option value="Caixa">Caixa</option>
            <option value="Barraca">Barraca</option>
            <option value="Almoxarifado">Almoxarifado</option>
          </select>
          <div className="flex">
            <button
              className="px-5 py-2 bg-violet-800 rounded-sm text-lg font-semibold mt-10"
              type="submit"
            >
              Editar Operário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorker;
