import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ShopCard = ({ name, id }) => {
  return (
    <div className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-3`}>
      <div
        className={`w-full dark:bg-gray-800/50 shadow-lg rounded-lg overflow-hidden`}
      >
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-white mb-2">
            {name}
          </h2>
          <hr className="my-4" />
          <Link to={`/details-shop/${id}`}>
            <button className="px-3 py-2 bg-violet-900 w-full rounded-sm text-lg font-medium hover:bg-violet-800 transition-colors duration-300">
              {" "}
              Acessar Barraca
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

ShopCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
};

export default ShopCard;
