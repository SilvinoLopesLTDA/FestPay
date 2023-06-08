import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../../pages/client/Client.module.scss";

const FormShop = ({ shop, saveShop, handleInputChange, required }) => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (shop.name && shop.password && shop.cost) {
      saveShop(shop);
      navigate("/shops");
    } else {
      navigate("/add-shop");
    }
  };

  const saveShopData = () => {
    const shopData = {
      ...shop,
    };
    saveShop(shopData);
  };
  return (
    <div>
      <form
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
          saveShop(e);
        }}
      >
        <label htmlFor="name">
          Nome <span className="text-red-600">{required}</span>
        </label>
        <input
          type="text"
          placeholder="Bebidas..."
          name="name"
          id="name"
          value={shop?.name}
          onChange={handleInputChange}
          className={
            isSubmitted && shop?.name === "" ? `${styles.highlight}` : ""
          }
        />
        <label htmlFor="password">
          Senha <span className="text-red-600">{required}</span>
        </label>
        <input
          type="password"
          placeholder="4582"
          name="password"
          id="password"
          value={shop?.password}
          onChange={handleInputChange}
          className={
            isSubmitted && shop?.password === "" ? `${styles.highlight}` : ""
          }
        />
        <label htmlFor="cost">
          Custo <span className="text-red-600"> {required}</span>
        </label>
        <input
          type="text"
          placeholder="20"
          name="cost"
          id="cost"
          value={shop?.cost}
          onChange={handleInputChange}
          className={
            isSubmitted && shop?.cost === "" ? `${styles.highlight}` : ""
          }
        />
        <label htmlFor="profit">Lucro</label>
        <input
          type="text"
          placeholder="40"
          name="profit"
          id="profit"
          value={shop?.profit}
          onChange={handleInputChange}
          className={
            isSubmitted && shop?.profit === "" ? `${styles.highlight}` : ""
          }
        />
        <button
          type="submit"
          className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium mt-10"
          onClick={saveShopData}
        >
          Salvar
        </button>
      </form>
    </div>
  );
};

FormShop.propTypes = {
  shop: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleInputChange: PropTypes.func,
  saveShop: PropTypes.func,
  required: PropTypes.string,
};

export default FormShop;
