import styles from "./Footer.module.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  const repoUrl = "https://github.com/SilvinoLopesLTDA/FestPay";
  const currentYear = new Date().getFullYear();
  const version = "v1.0.0-beta";

  return (
    <div className={styles.footer}>
      <div className={styles.info}>
        &copy; FestPay |{" "}
        <a href={repoUrl} target="_blank" rel="noreferrer">
          {version}
        </a>{" "}
        | {currentYear}
      </div>
      <div className={styles.links}>
        <Link to="/terms">Termos e Condições </Link>&nbsp;-&nbsp;
        <Link to="/privacy">Política de Privacidade </Link> &nbsp;-&nbsp;
        <Link to="/faq">FAQ</Link>
      </div>
    </div>
  );
};

export default Footer;
