import { Link } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { useState } from "react";
import { forgotPassword, validateEmail } from "../../services/authService";
import { toast } from "react-toastify";

const Forgot = () => {
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
  };

  return (
    <div className={`${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <h2> Esqueceu a Senha ? </h2>
          <p className="text-slate-400/75 text-lg">Siga os passos para redefinir a sua senha </p>
          <form onSubmit={forgot}>
            <div className={styles.fields}>
              <label htmlFor="email" className="text-slate-500/75"> Email </label>
              <input
                type="email"
                placeholder="exemplo@gmail.com"
                required
                id="email"
                name="email"
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
            <div className={styles.links}>
              <p className="text-slate-500/75">
                <Link to="/login"> {"< "}Voltar </Link>
              </p>
              <p className="text-slate-500/75">
                <Link to="/login"> Entrar{" >"} </Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Forgot;
