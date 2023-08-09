import { useParams } from "react-router-dom";
import Card from "../../../components/card/Card";
import styles from "../../../pages/auth/auth.module.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { updateAdmin } from "../../../services/authAdminService";

const initialState = {
  password: "",
  password2: "",
};

const CreateAdminPassword = () => {
  const [passwordData, setPasswordData] = useState(initialState);
  const { password, password2 } = passwordData;

  const { id } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const createPassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("A senha teve conter mais de 6 caracteres");
    }

    if (password !== password2) {
      return toast.error(
        "As senhas não iguais, Por favor preencha o campo corretamente"
      );
    }

    const formData = {
      password,
      password2,
    };

    try {
      const data = await updateAdmin(formData, id);
      toast.success(data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={`${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <h2> Obtenha a sua Senha </h2>
          <p className="text-slate-400/75 text-lg">
            Siga os passos para criar a sua senha{" "}
          </p>
          <form onSubmit={createPassword}>
            <div className={styles.fields}>
              <label htmlFor="password" className="text-slate-500/75">
                {" "}
                Senha{" "}
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
                Confirmar Senha{" "}
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
              Obter Senha
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CreateAdminPassword;
