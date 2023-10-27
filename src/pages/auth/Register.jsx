import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  registerUser,
  validateEmail,
} from "../../redux/features/auth/authService";
import Loader from "../../components/loader/Loader";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
};

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { name, email, password, password2 } = formData;

  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);

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
      await registerUser(userData);
      toast.success(
        "Um e-mail de confirmação foi enviado para o seu endereço de e-mail."
      );
      navigate("/login");
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
          <Link to="/" className="hover:text-violet-500">
            {" "}
            {"← "}Voltar{" "}
          </Link>
        </span>
        <div className={styles.form}>
          <h2> Crie sua conta</h2>
          <p className="text-slate-400/75 text-lg">
            Comece agora a ter controle da festa
            <div className={styles.register}>
              <Link to="/login">
                Já tem uma conta?{" "}
                <span className="font-semibold hover:text-violet-600">
                  Entre aqui
                </span>
              </Link>
            </div>
          </p>
          <form onSubmit={register}>
            <div className="mt-5">
              <label htmlFor="name" className="text-gray-500 font-semibold">
                {" "}
                Nome<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                placeholder="Digite aqui o seu nome..."
                required
                id="name"
                name="name"
                value={name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-2">
              <label htmlFor="email" className="text-gray-500 font-semibold">
                {" "}
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
              />
            </div>
            <div className="mt-2">
              <label htmlFor="password" className="text-gray-500 font-semibold">
                {" "}
                Senha<span className="text-red-600"> *</span>
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  placeholder="Digite aqui a sua senha..."
                  required
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  minLength="6"
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
            </div>
            <div className="mt-2">
              <label
                htmlFor="password2"
                className="text-gray-500 font-semibold"
              >
                {" "}
                Confirmar Senha<span className="text-red-600"> *</span>
              </label>
              <div className="relative">
                <input
                  type={visibleConfirm ? "text" : "password"}
                  placeholder="Digite aqui novamente a sua senha..."
                  required
                  id="password2"
                  name="password2"
                  value={password2}
                  onChange={handleInputChange}
                  minLength="6"
                />
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setVisibleConfirm(!visibleConfirm)}
                >
                  {visibleConfirm ? (
                    <AiOutlineEye color="#fff" size={25} />
                  ) : (
                    <AiOutlineEyeInvisible color="#fff" size={25} />
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
