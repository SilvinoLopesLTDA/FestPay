import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ShopContainer from "../../components/shop/shopContainer/ShopContainer";
import { getShops } from "../../redux/features/shop/shopSlice";
// import PasswordCard from "../../components/passwordCard/PasswordCard";

const Shop = () => {
  const dispatch = useDispatch();

  const { shop, isLoading, isError, message } = useSelector(
    (state) => state.shop
  );

  const currentItems = Array.isArray(shop) ? shop : [];

  useEffect(() => {
    dispatch(getShops());

    if (isError) {
      console.log(message);
    }
  }, [dispatch, isError, message]);

  const sortedShops = [...currentItems].sort((a, b) => {
    const dateA = new Date(b.createdAt);
    const dateB = new Date(a.createdAt);
    return dateA - dateB;
  });

  return (
    <div>
      {/* <PasswordCard componentId="shop" password={"1234"} /> */}
      <ShopContainer shop={sortedShops} isLoading={isLoading} />
    </div>
  );
};

Shop.propTypes = {
  shop: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default Shop;
