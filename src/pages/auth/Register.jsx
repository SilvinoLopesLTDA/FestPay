import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { name, email, password, password2 } = formData;

  const [visible, setVisible] = useState(true);
  const [visibleConfirm, setVisibleConfirm] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const register = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Preencha os campos corretamente");
    }

    if (password.length < 6) {
      return toast.error("A senha teve conter mais de 6 caracteres");
    }

    if (!validateEmail(email)) {
      return toast.error("Por favor digite um email valido");
    }

    if (password !== password2) {
      return toast.error(
        "As senhas não iguais, Por favor preencha o campo corretamente"
      );
    }

    const userData = {
      name,
      email,
      password,
    };

    setIsLoading(true);

    try {
      const data = await registerUser(userData);
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
          <h2> Crie sua conta</h2>
          <p className="text-slate-400/75 text-lg">
            Comece agora a ter controle da festa
            <div className={styles.register}>
              <Link to="/login">
                Já tem uma conta?{" "}
                <span className="font-semibold">Entre aqui</span>
              </Link>
            </div>
          </p>
          <form onSubmit={register}>
            <div className="mt-5">
              <label htmlFor="name" className="text-slate-500/75">
                {" "}
                Nome{" "}
              </label>
              <input
                type="text"
                placeholder="Matheus..."
                required
                id="name"
                name="name"
                value={name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-2">
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
                <div className={styles.toggleVisible} onClick={() => setVisible(!visible)}>
                  {visible ? (
                    <AiOutlineEye color="white" />
                  ) : (
                    <AiOutlineEyeInvisible color="white" />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <label htmlFor="password2" className="text-slate-500/75">
                {" "}
                Confirmar Senha{" "}
              </label>
              <div className="flex">
                <input
                  type={visibleConfirm ? "text" : "password"}
                  placeholder={visibleConfirm ? "123456" : "******"}
                  required
                  id="password2"
                  name="password2"
                  value={password2}
                  onChange={handleInputChange}
                />
                <div className={styles.toggleVisible} onClick={() => setVisibleConfirm(!visibleConfirm)}>
                  {visibleConfirm ? (
                    <AiOutlineEye color="white" />
                  ) : (
                    <AiOutlineEyeInvisible color="white" />
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-white py-2 text-lg font-semibold rounded bg-violet-700 mt-6"
            >
              {" "}
              Criar Conta{" "}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Register;
