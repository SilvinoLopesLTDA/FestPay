import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { resetPassword } from "../../redux/features/auth/authService";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const initialState = {
  password: "",
  password2: "",
};

const Reset = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const { password, password2 } = formData;

  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);

  const { resetToken } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const reset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("A senha deve conter pelo menos 6 caracteres!");
    }

    if (password !== password2) {
      return toast.error(
        "As senhas não iguais! Por favor, preencha os campos corretamente."
      );
    }

    const userData = {
      password,
      password2,
    };

    try {
      const data = await resetPassword(userData, resetToken);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={`${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <h2>Alteração de senha</h2>
          <p className="text-slate-400/75 text-lg">
            Siga os passos para redefinir a sua senha:{" "}
          </p>
          <form onSubmit={reset}>
            <div className="mt-8 mb-6">
              <label htmlFor="password" className="text-gray-500 font-semibold">
                Nova senha<span className="text-red-600"> *</span>
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  placeholder="Digite aqui a sua nova senha..."
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
              <label htmlFor="password" className="text-gray-500 font-semibold">
                Confirme sua nova senha<span className="text-red-600"> *</span>
              </label>
              <div className="relative">
                <input
                  type={visibleConfirm ? "text" : "password"}
                  placeholder="Digite aqui novamente a sua nova senha..."
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
              Alterar Senha
            </button>
            <div className={styles.links}>
              <p className="text-[#94a3b8]">
                <Link to="/" className="hover:text-violet-500">
                  {" "}
                  {"< "}Voltar
                </Link>
              </p>
              <p className="text-[#94a3b8]">
                <Link to="/login" className="hover:text-violet-500">
                  {" "}
                  Entrar{" >"}{" "}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Reset;
