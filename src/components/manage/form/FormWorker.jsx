import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../../pages/client/Client.module.scss";
import { useDispatch } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import PassStyle from "./FormAdmin.module.scss";
import * as Components from "../../../pages/manage/addAdmin/Components";
import { getWorkers } from "../../../redux/features/Worker/Actions/workerSlice";

const FormWorker = ({ worker, saveWorker, handleInputWorkerChange, required }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, setIsSubmitted] = useState(false);
  const [visible, setVisible] = useState(true);

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value.replace(/\D/g, "");
    filteredValue = filteredValue.substring(0, 6);
    handleInputWorkerChange({ target: { name, value: filteredValue } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (worker.name && worker.email) {
      saveWorker(worker);
      navigate("/manage");
      dispatch(getWorkers());
    } else {
      navigate("/add-admin");
    }
  };

  const saveWorkerData = () => {
    const workerData = {
      ...worker,
    };
    saveWorker(JSON.stringify(workerData));
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
              value={worker?.name}
              onChange={handleInputWorkerChange}
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
              value={worker?.email}
              onChange={handleInputWorkerChange}
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
              value={worker?.password}
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
        <div className={styles.input}>
          <label htmlFor="func" className="flex justify-start my-3">
            Função <span className="text-red-600 mx-2">{required}</span>
          </label>
          <select
            name="func"
            id="func"
            className="w-full"
            value={worker.func}
            onChange={handleInputWorkerChange}
          >
            <option value="">Selecione a Função do Operário</option>
            <option value="Caixa">Caixa</option>
            <option value="Barraca">Barraca</option>
            <option value="Almoxarifado">Almoxarifado</option>
          </select>
        </div>
        <Components.Button onClick={saveWorkerData}>Salvar</Components.Button>
      </form>
    </div>
  );
};

FormWorker.propTypes = {
  worker: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleInputWorkerChange: PropTypes.func,
  saveWorker: PropTypes.func,
  required: PropTypes.string,
};

export default FormWorker;
