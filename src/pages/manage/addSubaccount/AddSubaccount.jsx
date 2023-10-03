import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  registerSubaccount,
  selectIsLoading,
} from "../../../redux/features/auth/authSlice";
import Loader from "../../../components/loader/Loader";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./AddSubaccounts.module.scss";

const AddSubaccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    workerFunction: null,
  });
  const [visible, setVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isLoading = useSelector(selectIsLoading);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      await dispatch(registerSubaccount(user));
      navigate("/manage");
    } catch (error) {
      console.error(error);
    }
  };

  const renderWorkerFunctionSelect = () => {
    if (user.role === "worker") {
      return (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Função do Trabalhador<span className="text-red-600"> *</span>
          </label>
          <select
            className={`w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 ${
              isSubmitted && user.workerFunction === ""
                ? `${styles.highlight}`
                : ""
            }`}
            name="workerFunction"
            value={user.workerFunction}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione a Função</option>
            <option value="Caixa">Caixa</option>
            <option value="Barraca">Barraca</option>
            <option value="Almoxarifado">Almoxarifado</option>
          </select>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex justify-center items-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold">
            Adicione uma{" "}
            <span className="text-violet-600 font-bold">Subconta</span>
          </h2>
          <Link to="/manage">
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300">
              Voltar
            </button>
          </Link>
        </div>
        <p className="mb-3 text-lg">- Adicione os dados da subconta abaixo</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nome<span className="text-red-600"> *</span>
            </label>
            <input
              className={`w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 ${
                isSubmitted && user.name === "" ? `${styles.highlight}` : ""
              }`}
              type="text"
              name="name"
              value={user.name}
              placeholder="Digite aqui o nome da subconta..."
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email<span className="text-red-600"> *</span>
            </label>
            <input
              className={`w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 ${
                isSubmitted && user.email === "" ? `${styles.highlight}` : ""
              }`}
              type="email"
              name="email"
              value={user.email}
              placeholder="Digite aqui o email da subconta..."
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Senha<span className="text-red-600"> *</span>
            </label>
            <div className="flex">
              <input
                className={`w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 ${
                  isSubmitted && user.password === ""
                    ? `${styles.highlight}`
                    : ""
                }`}
                type={visible ? "text" : "password"}
                placeholder="Digite aqui a senha da subconta..."
                required
                name="password"
                value={user.password}
                onChange={handleInputChange}
                minLength="6"
              />
              <div
                className="cursor-pointer ml-2 flex items-center"
                onClick={() => setVisible(!visible)}
              >
                {visible ? (
                  <AiOutlineEye color="#fff" size={25} />
                ) : (
                  <AiOutlineEyeInvisible color="#fff" size={25} />
                )}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cargo<span className="text-red-600"> *</span>
            </label>
            <select
              className={`w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 ${
                isSubmitted && user.role === "" ? `${styles.highlight}` : ""
              }`}
              name="role"
              value={user.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione um cargo</option>
              <option value="admin">Administrador</option>
              <option value="worker">Trabalhador</option>
            </select>
          </div>
          {renderWorkerFunctionSelect()}
          <button
            className="bg-violet-800 text-lg font-medium py-2 px-4 rounded-sm mt-4 w-full hover:bg-violet-700 transition-colors duration-300"
            type="submit"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubaccount;
