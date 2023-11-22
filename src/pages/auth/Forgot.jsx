import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { useState } from "react";
import {
  forgotPassword,
  validateEmail,
} from "../../redux/features/auth/authService";
import { toast } from "react-toastify";

const Forgot = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const forgot = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Preencha o campo corretamente");
    }

    if (!validateEmail(email)) {
      return toast.error("Por favor digite um email valido");
    }

    const userData = {
      email,
    };

    await forgotPassword(userData);
    setEmail("");
    navigate("/login");
  };

  return (
    <div className={`${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className={styles.links}>
            <p className="text-[#94a3b8]">
              <Link to="/login" className="hover:text-violet-500">
                {" "}
                {"< "}Voltar{" "}
              </Link>
            </p>
            <p className="text-[#94a3b8]">
              <Link to="/login" className="hover:text-violet-500">
                {" "}
                Entrar{" >"}{" "}
              </Link>
            </p>
          </div>
          <h2> Esqueceu a Senha? </h2>
          <p className="text-slate-400/75 text-lg">
            Siga os passos a seguir para redefinir a senha{" "}
          </p>
          <form onSubmit={forgot}>
            <div className={`mt-8 ${styles.fields}`}>
              <label htmlFor="email" className="text-gray-500 font-semibold">
                Email<span className="text-red-600"> *</span>
              </label>
              <input
                type="email"
                placeholder="Digite aqui o seu email..."
                required
                id="email"
                name="email"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full text-white py-2 text-lg font-semibold rounded bg-violet-700 mt-6"
            >
              {" "}
              Recuperar Senha{" "}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Forgot;
