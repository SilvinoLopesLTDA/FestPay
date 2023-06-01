import PropTypes from "prop-types";
import styles from "./Sidebar.module.scss";
import { GiGamepadCross } from "react-icons/gi";
import { HiMenuAlt3 } from "react-icons/hi";
import menu from "../../data/sidebar";
import SidebarItem from "./SidebarItem";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (window.innerWidth < 600) {
      setIsOpen(false);
    }
  }, []);

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

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
            <GiGamepadCross
              size={35}
              style={{ cursor: "pointer" }}
              onClick={goHome}
            />
          </div>
          <div
            className={`${styles.bars} ${styles.isClosed}`}
            style={{ marginLeft: isOpen ? "100px" : "0px" }}
          >
            <HiMenuAlt3 onClick={toggle} />
          </div>
          <div className={`${styles.logo} ${styles.small_devices}`}>
            <GiGamepadCross
              size={35}
              style={{ cursor: "pointer" }}
              onClick={goHome}
            />
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
