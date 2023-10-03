import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  createItem,
  getItems,
  selectIsLoading,
} from "../../../redux/features/items/itemsSlice";
import Loader from "../../../components/loader/Loader";
import styles from "../../client/Client.module.scss";
import FormItem from "../../../components/forms/storage/FormItem";

const initialState = {
  name: "",
  price: "",
  quantity: "",
};

const AddItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [item, setItem] = useState(initialState);
  const [submittedItems, setSubmittedItems] = useState([]);

  const { name, price, quantity } = item;

  const isLoading = useSelector(selectIsLoading);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const saveItem = async () => {
    event.preventDefault();
    const formData = {
      name: name,
      price: price,
      quantity: quantity,
    };
    console.log(formData);
    await dispatch(createItem(formData));

    if (item.name && item.price && item.quantity) {
      const newItem = { ...item };
      setSubmittedItems([...submittedItems, newItem]);
      setItem(initialState);
      dispatch(getItems());
      navigate("/storage");
    }
  };

  return (
    <div className="flex justify-center items-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold">
            Adicione um <span className="text-violet-600 font-bold">Item</span>
          </h2>
          <Link to="/storage">
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300">
              {" "}
              Voltar
            </button>
          </Link>
        </div>
        <p className="mb-3 text-lg">- Adicione os dados do item abaixo</p>
        <FormItem
          item={item}
          saveItem={saveItem}
          handleInputChange={handleInputChange}
          required={"*"}
        />
      </div>
    </div>
  );
};

AddItems.propTypes = {
  item: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleInputChange: PropTypes.func,
  saveItem: PropTypes.func,
};

export default AddItems;
