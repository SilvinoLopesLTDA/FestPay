import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../../pages/client/Client.module.scss";
import PassStyle from "./FormShop.module.scss"
import { useDispatch } from "react-redux";
import { getShops } from "../../../redux/features/shop/shopSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const FormShop = ({ shop, saveShop, handleInputChange, required }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (shop.name && shop.password && shop.cost) {
      saveShop(shop);
      navigate("/shops");
      dispatch(getShops());
    } else {
      navigate("/add-shop");
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

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value.replace(/\D/g, "");
    filteredValue = filteredValue.substring(0, 4);
    handleInputChange({ target: { name, value: filteredValue } });
  };

  const saveShopData = () => {
    const shopData = {
      ...shop,
    };
    saveShop(JSON.stringify(shopData));
  };

  return (
    <div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
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
        <label htmlFor="password" className="text-slate-500/75">
          {" "}
          Senha{" "}<span className="text-red-600">{required}</span>
        </label>
        <div className="flex">
          <input
            type={visible ? "text" : "password"}
            placeholder={visible ? "1234" : "****"}
            required
            className="w-full"
            id="password"
            name="password"
            value={shop?.password}
            onChange={handlePwdChange}
          />
          <div
            className={PassStyle.toggleVisible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? (
              <AiOutlineEye color="#0f172a" />
            ) : (
              <AiOutlineEyeInvisible color="#0f172a" />
            )}
          </div>
        </div>
        <label htmlFor="cost">
          Custo <span className="text-red-600"> {required}</span>
        </label>
        <input
          type="text"
          placeholder="20"
          name="cost"
          id="cost"
          value={shop?.cost}
          onChange={handlePriceChange}
          className={
            isSubmitted && shop?.cost === "" ? `${styles.highlight}` : ""
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
