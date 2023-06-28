import { Link, useNavigate } from "react-router-dom";
import styles from "./Welcome.module.scss";
import Logo from "/assets/Logo.png";
import { BsArrowRightShort } from "react-icons/bs";
import { ShowOnLogin, ShowOnLogout } from "../../components/protect/HiddenLink";

const Welcome = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div
      className={`${styles.banner} flex flex-col justify-center text-center`}
    >
      <header className={styles.wrapper}>
        <span className={styles.icon} onClick={goHome}>
          <img src={Logo} alt="FestPay Logo" />
        </span>
        <span className="mt-12">
          <div className={`${styles.logoff_btn} flex`}>
            <ShowOnLogout>
              <button
                className={`${styles.btn} px-5 py-2 mx-5 border-2 rounded-lg text-lg font-semibold hover:text-slate-950 drop-shadow-Cxl`}
              >
                <Link to="/login">Entrar</Link>
              </button>
            </ShowOnLogout>
            <ShowOnLogout>
              <button
                className={`${styles.register} px-5 py-2 text-lg font-semibold text-slate-950 rounded-lg`}
              >
                <Link to="/register">Cadastrar-se</Link>
              </button>
            </ShowOnLogout>
          </div>
          <ShowOnLogin>
            <button
              className={`${styles.btn} ${styles.btn_sm}  px-5 py-2 mx-5 border-2 rounded-lg text-lg font-semibold hover:text-slate-950 drop-shadow-Cxl`}
            >
              <Link to="/shops">Entre em nosso aplicativo!</Link>
            </button>
          </ShowOnLogin>
        </span>
      </header>
      <h2 className="text-4xl font-semibold"> Bem-vindo(a) ao FestPay</h2>
      <div className="flex justify-center mt-20">
        <button
          className={`${styles.btn} w-72 py-3 border-2 rounded-full text-xl font-semibold hover:text-slate-950 drop-shadow-Cxl`}
        >
          <Link to="/register">
            <span className="flex justify-center">
              Comece Agora
              <BsArrowRightShort size={35} />
            </span>
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Welcome;
