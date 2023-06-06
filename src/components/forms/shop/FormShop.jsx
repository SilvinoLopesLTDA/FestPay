import { useState } from "react";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

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

const FormShop = ({
  shop,
  saveShop,
  handleInputChange,
}) => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shopData, setShopData] = useState(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (shopData.name && shopData.profit && shopData.cost) {
      saveShop(shopData);
      navigate("/shops");
    } else {
      console.log("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  const handleClick = () => {
    navigate("/shops")
  }

  return (
    <div>
      <button
        className="--btn --btn-primary"
        style={{ margin: "1.5em 0", paddingLeft: ".85em" }}
        onClick={handleClick}
      >
        {" "}
        <MdOutlineKeyboardDoubleArrowLeft style={{ marginRight: "0.3em" }} />
        Voltar{" "}
      </button>
      <h2> Adicionar Pagamento </h2>
      <div className="add-payment">
        <div className="blockL" style={{ width: "100%" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
              saveShop(e);
            }}
          >
            <div className="form-container">
              <label htmlFor="name">
                Nome <span> *</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={shop?.name}
                onChange={handleInputChange}
                className={isSubmitted && shop?.name === "" ? "highlight" : ""}
              />
              <label htmlFor="profit">
                Lucro <span> *</span>
              </label>
              <input
                type="text"
                name="profit"
                id="profit"
                value={shop?.profit}
                onChange={handleInputChange}
                className={
                  isSubmitted && shop?.profit === "" ? "highlight" : ""
                }
              />
              <label htmlFor="cost">
                Custo <span> *</span>
              </label>
              <input
                type="text"
                name="cost"
                id="cost"
                value={shop?.cost}
                onChange={handleInputChange}
                className={isSubmitted && shop?.cost === "" ? "highlight" : ""}
              />
              <div className="--my">
                <button className="--btn --btn-primary" onClick={(e) => saveShop(e)}>
                  {" "}
                  Salvar{" "}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

FormShop.propTypes = {
  shop: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleInputChange: PropTypes.func,
  saveShop: PropTypes.func,
};

export default FormShop;
