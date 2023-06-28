import PropTypes from "prop-types";
import styles from "./Sidebar.module.scss";
import { HiMenuAlt3 } from "react-icons/hi";
import menu from "../../data/sidebar";
import SidebarItem from "./SidebarItem";
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "/assets/Logo-2.png";
import { useEffect } from "react";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (window.innerWidth < 600) {
      setIsOpen(false);
    }
  }, []);

  return (
    <div className={`${styles.layout}`}>
      <div
        className={`${styles.sidebar} bg-slate-900`}
        style={{ width: isOpen ? "230px" : "60px" }}
      >
        <div className={`${styles.top_section} bg-violet-900`}>
          <div
            className={`${styles.logo}`}
            style={{ display: isOpen ? "block" : "none" }}
          >
            <Link to="/">
              <img src={Logo} alt="FestPay Logo" />
            </Link>
          </div>
          <div
            className={`${styles.bars} ${styles.isClosed}`}
            style={{ marginLeft: isOpen ? "100px" : "0px" }}
          >
            <HiMenuAlt3 onClick={toggle} />
          </div>
          <div className={` ${styles.small_devices}`}>
            <Link to="/">
              <img src={Logo} alt="FestPay Logo" />
            </Link>
          </div>
        </div>
        {menu.map((item, index) => {
          return <SidebarItem key={index} item={item} isOpen={isOpen} />;
        })}
      </div>
      <main
        style={{
          paddingLeft: isOpen ? "230px" : "60px",
          transition: "all .5s",
        }}
      >
        {children}
      </main>
    </div>
  );
};

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Sidebar;
