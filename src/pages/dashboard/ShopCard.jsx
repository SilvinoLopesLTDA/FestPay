import PropTypes from "prop-types";

const ShopCard = ({ name, profit, cost, isGuicheRecarga }) => {
  let borderClass = "border-[0.5px] border-gray-500";

  if (profit > cost) {
    borderClass = "border-[0.5px] border-green-500";
  } else if (cost > profit) {
    borderClass = "border-[0.5px] border-red-500";
  }

  const cardClasses = `dark:bg-gray-800/50 shadow-lg rounded-lg overflow-hidden ${borderClass} ${
    isGuicheRecarga ? "border border-green-500 py-5" : ""
  }`;

  return (
    <div className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2`}>
      <div className={`w-full ${cardClasses}`}>
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-white mb-2">
            {name}
          </h2>
          <hr className="my-2" />
          <p className="text-xl font-bold text-center text-green-500">
            Lucros: R${profit ? profit : 0}
          </p>
          {!isGuicheRecarga && (
            <p className="text-xl mt-2 font-bold text-center text-rose-700">
              Custos: R${cost ? cost : 0}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

ShopCard.propTypes = {
  name: PropTypes.string,
  profit: PropTypes.number,
  cost: PropTypes.number,
  isGuicheRecarga: PropTypes.bool,
};

export default ShopCard;
