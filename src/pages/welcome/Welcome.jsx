import { Link, useNavigate } from "react-router-dom";
import styles from "./Welcome.module.scss";
import Logo from "/assets/Logo.webp";
import { BsArrowRightShort } from "react-icons/bs";
import {
  ShowOnLogin,
  ShowOnLogout,
} from "../../components/protect/HiddenLink.jsx";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/features/auth/authSlice.js";

const Welcome = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div
      className={`${styles.banner} flex flex-col justify-center text-center`}
    >
      <header className={styles.wrapper}>
        <span className={styles.icon} onClick={() => goTo("/")}>
          <img src={Logo} alt="FestPay Logo" height="150px" width="150px" />
        </span>
        <span className="mt-12">
          <div className={`${styles.logoff_btn} flex`}>
            <ShowOnLogout>
              <button
                className={`${styles.btn} px-5 py-2 mx-5 border-2 rounded-lg text-lg font-semibold hover:text-slate-950 drop-shadow-Cxl sm:relative sm:-top-3`}
              >
                <Link to="/login">Entrar</Link>
              </button>
              <button
                className={`${styles.register} px-5 py-2 text-lg font-semibold text-slate-950 rounded-lg sm:relative sm:-top-3`}
              >
                <Link to="/register">Cadastrar-se</Link>
              </button>
            </ShowOnLogout>
          </div>
          <ShowOnLogin>
            <button
              className={`${styles.btn} ${styles.btn_sm}  px-5 py-2 mx-5 border-2 rounded-lg text-lg font-semibold hover:text-slate-950 drop-shadow-Cxl`}
            >
              <Link to="/home">Entre em nosso aplicativo!</Link>
            </button>
          </ShowOnLogin>
        </span>
      </header>
      <h2 className="text-7xl font-semibold w-full">
        Bem-vindo(a) ao FestPay!
      </h2>
      {!isLoggedIn && (
        <div className="flex justify-center items-center">
          <button
            className={`${styles.btn} w-72 py-3 border-2 rounded-full text-xl font-semibold hover:text-slate-950 drop-shadow-Cxl`}
          >
            <Link to="/register">
              <div className="flex items-center justify-center">
                <p className="mr-2">Comece Agora</p>
                <BsArrowRightShort size={35} />
              </div>
            </Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default Welcome;
