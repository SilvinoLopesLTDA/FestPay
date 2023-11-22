import PropTypes from "prop-types";
import styles from "./Sidebar.module.scss";
import { HiMenuAlt3 } from "react-icons/hi";
import SidebarItem from "./SidebarItem";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "/assets/Logo-2.webp";
import Menu from "../../data/Menu";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 600);
  // const [expandMenu, setExpandMenu] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsOpen(window.innerWidth >= 600);
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <div className={`${styles.layout}`}>
      <div
        className={`${styles.sidebar} bg-slate-900`}
        style={{ width: isOpen ? "230px" : "60px" }}
      >
        <div className={`${styles.top_section} bg-violet-900`}>
          {/* {expandMenu ? (
              <div> teste </div>
          ) : (
           <span> teste  2</span>
          )} */}
          {isOpen && (
            <div className={`${styles.logo}`}>
              <Link to="/">
                <img src={Logo} alt="FestPay Logo" />
              </Link>
            </div>
          )}
          <div
            className={`${styles.bars} ${styles.isClosed}`}
            style={{ marginLeft: isOpen ? "100px" : "0px" }}
          >
            <HiMenuAlt3 onClick={toggle} />
          </div>
          {!isOpen && (
            <div className={` ${styles.small_devices}`}>
              <Link to="/">
                <img src={Logo} alt="FestPay Logo" />
              </Link>
            </div>
          )}
        </div>
        {Menu().map((item) => {
          if (!item.visible) {
            return null;
          }
          return <SidebarItem key={item.title} item={item} isOpen={isOpen} />;
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
  children: PropTypes.node,
};

export default Sidebar;
