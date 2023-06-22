import PropTypes from "prop-types";
// import Footer from "../footer/Footer";

import styles from "./Layout.module.scss";
import Footer from "../footer/Footer";
import Header from "../header/Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className={`${styles.layout} --pad`}>{children}</div>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;