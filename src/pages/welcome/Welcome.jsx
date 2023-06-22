import { Link, useNavigate } from "react-router-dom";
import styles from "./Welcome.module.scss";
import Logo from "/assets/Logo.png";
import { BsArrowRightShort } from "react-icons/bs";

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
          <button
            className={`${styles.btn} px-5 py-2 mx-5 border-2 rounded-lg text-lg font-semibold hover:text-slate-950 drop-shadow-Cxl`}
          >
            <Link to="/">Entrar</Link>
          </button>
          <button
            className={`${styles.register} px-5 py-2 text-lg font-semibold text-slate-950 rounded-lg`}
          >
            <Link to="/">Cadastrar-se</Link>
          </button>
        </span>
      </header>
      <h2 className="text-4xl font-semibold"> Bem-vindo(a) ao FestPay</h2>
      <div className="flex justify-center mt-20">
        <button
          className={`${styles.btn} w-72 py-3 border-2 rounded-full text-xl font-semibold hover:text-slate-950 drop-shadow-Cxl`}
        >
          <Link to="/shops">
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
