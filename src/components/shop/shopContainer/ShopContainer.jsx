import PropTypes from "prop-types";
import { SpinnerImg } from "../../loader/Loader";
import { selectIsLoading } from "../../../redux/features/shop/shopSlice";
import ShopCard from "../shopCard/ShopCard";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ShopContainer = ({ shop }) => {
  const isLoading = useSelector(selectIsLoading);

  return (
    <div className="flex justify-center items-center h-full flex-col">
      <div className="bg-slate-900 w-4/5 my-16">
        <div className="flex justify-between items-center mx-10 my-7">
          {isLoading && <SpinnerImg />}
          <h3 className="text-2xl font-semibold mt-6">
            {" "}
            Pontos de <span className="text-violet-700 font-bold">Vendas</span>
          </h3>
          <Link to="/add-shop">
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium mt-5">
              Adicionar Barraca
            </button>
          </Link>
        </div>
        <div className="shop-container">
          <ShopCard shop={shop} />
        </div>
      </div>
    </div>
  );
};

ShopContainer.propTypes = {
  shop: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};

export default ShopContainer;
