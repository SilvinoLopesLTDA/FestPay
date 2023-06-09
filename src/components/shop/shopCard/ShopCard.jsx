import PropTypes from "prop-types";
import { SpinnerImg } from "../../loader/Loader";
import styles from "./ShopCard.module.scss";
import { Link } from "react-router-dom";

const ShopCard = ({ shop, isLoading }) => {
  const currentItems = Array.isArray(shop) ? shop : [];

  return (
    <div
      className={`${styles.cardContainer} grid grid-cols-3 gap place-items-center flex-wrap h-full my-8`}
    >
      {isLoading && <SpinnerImg />}
      {!isLoading && shop.length === 0 ? (
        <p className={`${styles.placeholder} px-10`}>
          -- Nenhum ponto de venda cadastrado. Por favor, adicione um Ponto de
          venda!
        </p>
      ) : (
        currentItems.map((shop) => {
          const { _id, name } = shop;
          return (
            <div
              key={_id}
              className="bg-slate-950/50 drop-shadow-4xl w-10/12 p-5 my-5 rounded"
            >
              <h2 className="bg-slate-900 p-2 text-lg font-semibold mb-5 text-center">
                {name}
              </h2>
              <Link to={`/details-shop/${_id}`}>
                <button className="px-3 py-2 bg-violet-950 w-full rounded-sm text-lg font-medium">
                  {" "}
                  Acessar Barraca
                </button>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
};

ShopCard.propTypes = {
  shop: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  isLoading: PropTypes.bool,
};

export default ShopCard;
