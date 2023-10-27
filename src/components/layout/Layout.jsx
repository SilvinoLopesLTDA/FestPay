import { useEffect } from "react";
import PropTypes from "prop-types";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import { useRedirectLoggedOutUser } from "../../customHook/useRedirectLoggedOutUser";

const Layout = ({ children }) => {
  useEffect(() => {
    if (sessionStorage.getItem("shouldReloadDashboard")) {
      window.location.reload();
      sessionStorage.removeItem("shouldReloadDashboard");
    }
  }, []);

  useRedirectLoggedOutUser("/login");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
