import { Link } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { AiOutlineMail } from "react-icons/ai";
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
    <div className={`${styles.auth_square}`}>
      <Card>
        <div className={styles.form_square}>
          <div className="--flex-center">
            <AiOutlineMail size={35} color="#999" />
          </div>
          <h2> Esqueceu a Senha ? </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: " 1.6em",
              marginTop: "1rem",
            }}
          >
            Siga os passos para redefinir a sua senha{" "}
          </p>
          <form onSubmit={forgot}>
            <div className={styles.fields}>
              <label htmlFor="email"> Email </label>
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
              className={`--btn --btn-primary --btn-block ${styles.btn_square}`}
            >
              {" "}
              Recuperar Senha{" "}
            </button>
            <div className={styles.links}>
              <p>
                <Link to="/"> {"< "}Voltar </Link>
              </p>
              <p>
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
