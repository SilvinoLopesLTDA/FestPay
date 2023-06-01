import PropTypes from "prop-types";
import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";

const activeLink = ({ isActive }) =>
  isActive ? `${styles.active}` : `${styles.link}`;

const activeSublink = ({ isActive }) =>
  isActive ? `${styles.active}` : `${styles.link}`;

const SidebarItem = ({ item, isOpen }) => {
  const [expandMenu, setExpandMenu] = useState(false);

  if (item.childrens) {
    return (
      <div
        className={
          expandMenu
            ? `${styles.sidebar_item} ${styles.s_parent} ${styles.open}`
            : `${styles.sidebar_item} ${styles.s_parent}`
        }
      >
        <div className={`${styles.sidebar_title}`}>
          <span>
            {item.icon && <div className={`${styles.icon}`}>{item.icon}</div>}
            {isOpen && <div>{item.title}</div>}
          </span>
          <MdKeyboardArrowRight
            size={25}
            className={styles.arrow_icon}
            onClick={() => setExpandMenu(!expandMenu)}
          />
        </div>
        <div className={`${styles.sidebar_content}`}>
          {item.childrens.map((child, index) => {
            return (
              <div key={index} className={`${styles.s_child}`}>
                <NavLink to={child.path} className={activeSublink}>
                  <div className={`${styles.sidebar_item}`}>
                    <div className={`${styles.sidebar_title}`}>
                      <span>
                        {child.icon && (
                          <div className={`${styles.icon}`}>{child.icon}</div>
                        )}
                        {isOpen && <div>{child.title}</div>}
                      </span>
                    </div>
                  </div>
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <NavLink to={item.path} className={activeLink}>
        <div className={`${styles.sidebar_item} ${styles.s_parent}`}>
          <div className={`${styles.sidebar_title}`}>
            <span>
              {item.icon && (
                <div className={`${styles.icon} my-2`}>{item.icon}</div>
              )}
              {isOpen && <div className="text-xl my-1">{item.title}</div>}
            </span>
          </div>
        </div>
      </NavLink>
    );
  }
};

SidebarItem.propTypes = {
  item: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default SidebarItem;
