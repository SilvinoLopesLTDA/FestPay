import PropTypes from "prop-types";
import styles from "./Card.module.scss";

const Card = ({ children, cardClass }) => {
  return <div className={`${styles.card} ${cardClass}`}>{children}</div>;
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  cardClass: PropTypes.string,
};

export default Card;
