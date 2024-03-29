import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { LoginUser, validateEmail } from "../../services/authService";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { email, password } = formData;

  const [visible, setVisible] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Preencha os campos corretamente");
    }

    if (!validateEmail(email)) {
      return toast.error("Por favor digite um email valido");
    }

    const userData = {
      email,
      password,
    };

    setIsLoading(true);

    try {
      const data = await LoginUser(userData);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error.message);
    }
  };

  return (
    <div className={`${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <span style={{ color: "#94a3b8" }}>
          <Link to="/"> {"← "}Voltar </Link>
        </span>
        <div className={styles.form}>
          <h2> Entre em sua Conta </h2>
          <p className="text-slate-400/75 text-lg">
            Aqui é onde você gerencia a festa
            <div className={styles.register}>
              <Link to="/register">
                {" "}
                Não tem uma Conta?
                <span className="font-semibold"> Registre-se aqui</span>{" "}
              </Link>
            </div>
          </p>
          <form onSubmit={login}>
            <div className="mt-8">
              <label htmlFor="email" className="text-slate-500/75">
                {" "}
                Email{" "}
              </label>
              <input
                type="email"
                placeholder="exemplo@gmail.com"
                required
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-2">
              <label htmlFor="password" className="text-slate-500/75">
                {" "}
                Senha{" "}
              </label>
              <div className="flex">
                <input
                  type={visible ? "text" : "password"}
                  placeholder={visible ? "123456" : "******"}
                  required
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                />
                <div
                  className={styles.toggleVisible}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? (
                    <AiOutlineEye color="white" />
                  ) : (
                    <AiOutlineEyeInvisible color="white" />
                  )}
                </div>
              </div>
              <p className="text-center text-slate-400/75 font-semibold hover:text-indigo-500/75">
                <Link to="/forgot">Esqueceu a Senha?</Link>
              </p>
            </div>
            <button
              type="submit"
              className="w-full text-white py-2 text-lg font-semibold rounded bg-violet-700 mt-6"
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
