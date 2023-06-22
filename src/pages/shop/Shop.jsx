import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ShopContainer from "../../components/shop/shopContainer/ShopContainer";
import { getShops } from "../../redux/features/shop/shopSlice";

const Shop = () => {
  const dispatch = useDispatch();

  const { shop, isLoading, isError, message } = useSelector(
    (state) => state.shop
  );

  useEffect(() => {
      dispatch(getShops());
  
    if (isError) {
      console.log(message);
    }
  }, [dispatch, isError, message]);

  return (
    <div>
      <PasswordCard componentId="shop" password={"1234"} />
      <ShopContainer shop={shop} isLoading={isLoading} />
    </div>
  );
};

Shop.propTypes = {
  shop: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default Shop