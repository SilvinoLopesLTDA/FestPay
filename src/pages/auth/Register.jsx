import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

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
      navigate("/shops");
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
        <div className={styles.form}>
          <span className={styles.register} style={{ color: "#0a1930" }}>
            <Link to="/"> {"< "}Voltar </Link>
          </span>
          <h2> Conecte-se e Gerencie</h2>
          <span className={styles.register}>
            <p>
              Já tem uma conta ?
              <Link to="/login" style={{ color: "#EF233C", fontWeight: "600" }}>
                {" "}
                Entre aqui{" "}
              </Link>
            </p>
          </span>
          <form onSubmit={register}>
            <div className={styles.fields} style={{ marginTop: "5.5em" }}>
              <label htmlFor="name"> Nome </label>
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
            <div className={styles.fields}>
              <label htmlFor="email"> Email </label>
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
            <div className={styles.fields}>
              <label htmlFor="password"> Senha </label>
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
              <label htmlFor="password2"> Confirmar Senha </label>
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
            <button type="submit" className="--btn --btn-primary --btn-block">
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
