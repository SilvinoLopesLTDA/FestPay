import { Link, useParams } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { resetPassword } from "../../services/authService";

const initialState = {
  password: "",
  password2: "",
};

const Reset = () => {
  const [formData, setFormData] = useState(initialState);
  const { password, password2 } = formData;

  const { resetToken } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const reset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("A senha teve conter mais de 6 caracteres");
    }

    if (password !== password2) {
      return toast.error(
        "As senhas não iguais, Por favor preencha o campo corretamente"
      );
    }

    const userData = {
      password,
      password2,
    };

    try {
      const data = await resetPassword(userData, resetToken);
      toast.success(data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={`${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <h2> Mude a senha </h2>
          <p className="text-slate-400/75 text-lg">Siga os passos para redefinir a sua senha </p>
          <form onSubmit={reset}>
            <div className={styles.fields}>
              <label htmlFor="password" className="text-slate-500/75">
                {" "}
                Nova Senha{" "}
              </label>
              <input
                type="password"
                placeholder="******"
                required
                id="password"
                name="password"
                value={password}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.fields}>
              <label htmlFor="password2" className="text-slate-500/75">
                {" "}
                Confirmar Nova Senha{" "}
              </label>
              <input
                type="password"
                placeholder="******"
                required
                id="password2"
                name="password2"
                value={password2}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="w-full text-white py-2 text-lg font-semibold rounded bg-violet-700 mt-6"
            >
              {" "}
              Alterar Senha
            </button>
            <div className={styles.links}>
              <p className="text-slate-500/75">
                <Link to="/"> {"< "}Voltar</Link>
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

export default Reset;
