import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import styles from "./auth.module.scss";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { LoginUser, validateEmail } from "../../services/authService";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

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
          <h2> Conecte-se e Gerencie </h2>
          <span className={styles.register}>
            <p>
              Não tem uma conta ainda ?
              <Link
                to="/register"
                style={{ color: "#EF233C", fontWeight: "600" }}
              >
                {" "}
                Registre-se aqui{" "}
              </Link>
            </p>
          </span>
          <form onSubmit={login}>
            <div className={styles.fields} style={{ marginTop: "7em" }}>
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
              <p>
                Esqueceu a Senha?
                <Link
                  to="/forgot"
                  style={{ color: "#EF233C", fontWeight: "600" }}
                >
                  {" "}
                  Reedefina{" "}
                </Link>
              </p>
            </div>
            <button type="submit" className="--btn --btn-primary --btn-block">
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
