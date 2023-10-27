import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  LoginUser,
  validateEmail,
} from "../../redux/features/auth/authService";
import {
  SET_LOGIN,
  SET_NAME,
  SET_USER,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const [visible, setVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Preencha os campos corretamente!");
    }

    if (!validateEmail(email)) {
      return toast.error("Por favor, digite um email válido!");
    }

    const userData = {
      email,
      password,
    };

    setIsLoading(true);

    try {
      const response = await LoginUser(userData);
      dispatch(SET_LOGIN(true));
      dispatch(SET_NAME(response.name));
      dispatch(SET_USER(response));
      navigate("/home");
    } catch (error) {
      console.error(error.message);
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        if (
          errorMessage ===
          "Você precisa confirmar seu e-mail antes de fazer login."
        ) {
          toast.error(
            "Você precisa confirmar seu e-mail antes de fazer login."
          );
        } else if (
          errorMessage === "Email ou Senha incorretos! Tente novamente."
        ) {
          toast.error("Email ou Senha incorretos! Tente novamente.");
        } else if (
          errorMessage === "Usuário não encontrado. Por favor, cadastre-se!"
        ) {
          toast.error("Usuário não encontrado. Por favor, cadastre-se!");
        } else {
          toast.error("Erro ao fazer login. Tente novamente mais tarde.");
        }
      } else {
        toast.error("Erro ao fazer login. Tente novamente mais tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <span style={{ color: "#94a3b8" }}>
          <Link to="/" className="hover:text-violet-500">
            {" "}
            {"← "}Voltar{" "}
          </Link>
        </span>
        <div className={styles.form}>
          <h2> Entre em sua Conta </h2>
          <div className="text-slate-400/75 text-lg">
            Aqui é onde você gerencia a festa
            <div className={styles.register}>
              <Link to="/register">
                {" "}
                Não tem uma Conta?
                <span className="font-semibold hover:text-violet-600">
                  {" "}
                  Registre-se aqui
                </span>{" "}
              </Link>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6 mt-8">
              <label
                htmlFor="email"
                className="block text-gray-500 font-semibold mb-2"
              >
                Email<span className="text-red-600"> *</span>
              </label>
              <input
                type="email"
                placeholder="Digite aqui o seu email..."
                required
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-500 font-semibold mb-2"
              >
                Senha<span className="text-red-600"> *</span>
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  placeholder="Digite aqui sua senha..."
                  required
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  minLength="6"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none"
                />
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? (
                    <AiOutlineEye color="#fff" size={25} />
                  ) : (
                    <AiOutlineEyeInvisible color="#fff" size={25} />
                  )}
                </div>
              </div>
              <p className="text-center text-indigo-400 font-semibold mt-2 hover:text-indigo-500">
                <Link to="/forgot">Esqueceu a Senha?</Link>
              </p>
            </div>
            <button
              type="submit"
              className="w-full text-white py-2 text-lg font-semibold rounded bg-violet-700 mt-4"
            >
              {" "}
              Entrar{" "}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
