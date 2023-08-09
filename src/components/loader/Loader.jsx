import styles from "./Loader.module.scss";
import ReactDOM from "react-dom";
import { Oval } from "react-loader-spinner";

const Loader = () => {
  return ReactDOM.createPortal(
    <div className={styles.wrapper}>
      <div className={styles.loader}>
        <Oval
          height={80}
          width={80}
          color="#2937bd"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#5c39ba"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    </div>,
    document.getElementById("loader")
  );
};

export const SpinnerImg = () => {
  return (
    <div className="flex justify-center items-center">
      <Oval
        height={80}
        width={80}
        color="#2937bd"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#5c39ba"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default Loader;
