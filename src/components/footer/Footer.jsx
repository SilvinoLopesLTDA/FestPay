import { useState, useEffect } from "react";
import versionData from "./version/version.json";
import styles from "./Footer.module.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  const [version, setVersion] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const repoUrl = "https://github.com/SilvinoLopesLTDA/Gratiam";

  useEffect(() => {
    try {
      const { version: versionNumber } = versionData;
      setVersion(versionNumber);
    } catch (error) {
      console.error("Erro ao obter a versão do arquivo version.json:", error);
    }

    const year = new Date().getFullYear();
    setCurrentYear(year);
  }, []);

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
        <Link to="/privacy">Politica de Privacidade </Link> &nbsp;-&nbsp;
        <Link to="/faq">FAQ</Link>
      </div>
    </div>
  );
};

export default Footer;