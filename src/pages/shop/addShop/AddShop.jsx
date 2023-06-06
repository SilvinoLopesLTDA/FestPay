import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { createShop } from "../../../redux/features/shop/shopSlice";
import FormShop from "../../../components/forms/shop/formShop";

const initialState = {
  name: "",
  // client: "",
  // items: [
  //   {
  //     name: "",
  //     price: "",
  //   },
  // ],
  profit: "",
  cost: "",
};

const AddShop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shop, setShop] = useState(initialState);

  const { name, profit, cost } = shop;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShop({ ...shop, [name]: value });
  };

  const saveShop = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profit", profit);
    formData.append("cost", cost);

    console.log(...formData);

    await dispatch(createShop(formData));

    if (
      name &&
      profit &&
      cost &&
      name.trim() !== "" &&
      profit.trim() !== "" &&
      cost.trim() !== ""
    ) {
      navigate("/shops");
    }
  };

  return (
    <div>
      <h2> Shop form </h2>
      <FormShop
        shop={shop}
        saveShop={saveShop}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

AddShop.propTypes = {
  shop: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleInputChange: PropTypes.func,
  saveShop: PropTypes.func,
};

export default AddShop;
