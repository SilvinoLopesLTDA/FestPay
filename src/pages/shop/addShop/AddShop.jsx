import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  createShop,
  getShops,
  selectIsLoading,
} from "../../../redux/features/shop/shopSlice";
import FormShop from "../../../components/forms/shop/FormShop";
import Loader from "../../../components/loader/Loader";
import styles from "../../client/Client.module.scss";

const initialState = {
  name: "",
  password: "",
  profit: "",
  cost: "",
};

const AddShop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shop, setShop] = useState(initialState);
  const [submittedShops, setSubmittedShops] = useState([]);

  const { name, password, profit, cost } = shop;

  const isLoading = useSelector(selectIsLoading);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShop({ ...shop, [name]: value });
  };

  const saveShop = async (e) => {
    e.preventDefault();
    const formData = {
      name: name,
      password: password,
      profit: profit,
      cost: cost,
    };
    console.log(formData);
    await dispatch(createShop(formData));

    if (shop.name && shop.password && shop.cost) {
      const newShop = { ...shop };
      setSubmittedShops([...submittedShops, newShop]);
      setShop(initialState);
      dispatch(getShops());
      navigate("/shops")
    }
  };

  return (
    <div className="flex justify-center items-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold">
            Adicione uma{" "}
            <span className="text-violet-600 font-bold">Barraca</span>
          </h2>
          <Link to="/shops">
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300">
              {" "}
              Voltar
            </button>
          </Link>
        </div>
        <p className="mb-3 text-lg">- Adicione os dados da barraca abaixo</p>
        <FormShop
          shop={shop}
          saveShop={saveShop}
          handleInputChange={handleInputChange}
          required={"*"}
        />
      </div>
    </div>
  );
};

AddShop.propTypes = {
  shop: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleInputChange: PropTypes.func,
  saveShop: PropTypes.func,
};

export default AddShop;
