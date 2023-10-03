import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../../pages/client/Client.module.scss";
import { useDispatch } from "react-redux";
import { getItems } from "../../../redux/features/items/itemsSlice";

const FormItem = ({ item, saveItem, handleInputChange, required }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (item.name && item.price && item.quantity) {
      saveItem(item);
      navigate("/storage");
      dispatch(getItems());
    } else {
      navigate("/add-item");
    }
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/[^0-9.,]/g, "");
    const dotFilter = filteredValue.replace(",", ".");
    const decimalCount = dotFilter.split(".").length - 1;
    let cleanedValue = dotFilter;
    if (decimalCount > 1) {
      const lastIndex = dotFilter.lastIndexOf(".");
      cleanedValue =
        dotFilter.substring(0, lastIndex) + dotFilter.substring(lastIndex + 1);
    }
    handleInputChange({ target: { name, value: cleanedValue } });
  };

  const saveItemData = () => {
    const itemData = {
      ...item,
    };
    saveItem(JSON.stringify(itemData));
  };

  return (
    <div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="name">
          Nome <span className="text-red-600">{required}</span>
        </label>
        <input
          type="text"
          placeholder="Digite o nome do produto..."
          name="name"
          id="name"
          value={item?.name}
          onChange={handleInputChange}
          className={
            isSubmitted && item?.name === "" ? `${styles.highlight}` : ""
          }
        />
        <label htmlFor="price">
          Preço <span className="text-red-600"> {required}</span>
        </label>
        <input
          type="text"
          placeholder="Digite o preço do produto..."
          name="price"
          id="price"
          value={item?.price}
          onChange={handlePriceChange}
          className={
            isSubmitted && item?.price === "" ? `${styles.highlight}` : ""
          }
        />
        <label htmlFor="quantity">
          Quantidade <span className="text-red-600"> {required}</span>
        </label>
        <input
          type="text"
          placeholder="Digite a quantidade disponível do produto..."
          name="quantity"
          id="quantity"
          value={item?.quantity}
          onChange={handlePriceChange}
          className={
            isSubmitted && item?.quantity === "" ? `${styles.highlight}` : ""
          }
        />
        <button
          type="submit"
          className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium mt-10 hover:bg-violet-700 transition-colors duration-300"
          onClick={saveItemData}
        >
          Salvar
        </button>
      </form>
    </div>
  );
};

FormItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleInputChange: PropTypes.func,
  saveItem: PropTypes.func,
  required: PropTypes.string,
};

export default FormItem;
