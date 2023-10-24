import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../../pages/client/Client.module.scss";
import { useDispatch } from "react-redux";
import { getShops } from "../../../redux/features/shop/shopSlice";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const FormShop = ({ shop, saveShop, handleInputChange, required }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (shop.name && shop.password) {
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
          placeholder="Digite o nome da barraca..."
          name="name"
          id="name"
          value={shop?.name}
          onChange={handleInputChange}
          className={
            isSubmitted && shop?.name === "" ? `${styles.highlight}` : ""
          }
        />
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Senha<span className="text-red-600"> *</span>
        </label>
        <div className="flex">
          <input
            className={`w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 ${
              isSubmitted && shop?.password === "" ? `${styles.highlight}` : ""
            }`}
            type={visible ? "text" : "password"}
            placeholder="Digite a senha da barraca..."
            required
            name="password"
            value={shop?.password}
            onChange={handlePwdChange}
          />
          <div
            className="cursor-pointer ml-2 flex items-center"
            onClick={() => setVisible(!visible)}
          >
            {visible ? (
              <AiOutlineEye color="#fff" size={25} />
            ) : (
              <AiOutlineEyeInvisible color="#fff" size={25} />
            )}
          </div>
        </div>
        <label htmlFor="cost">Custo</label>
        <input
          type="text"
          placeholder="Digite aqui, se houver, o custo da barraca..."
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
