import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import QrReader from "react-qr-scanner";
import Loader from "../loader/Loader";
import {
  getShop,
  purchaseQRCode,
  selectIsLoading,
} from "../../redux/features/shop/shopSlice";

const initialState = {
  email: "",
  purchaseAmount: "",
};

const QrCodeReader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, setQrscan] = useState("Sem Resultados");
  const [isReadingEnabled, setIsReadingEnabled] = useState(true);
  const [shopInitial, setShop] = useState(initialState);
  const isLoading = useSelector(selectIsLoading);

  const { shop } = useSelector((state) => state.shop);
  const { _id } = shop;
  const { email, purchaseAmount } = shopInitial;
  console.log(shop.name);

  const handleScan = (data) => {
    if (isReadingEnabled && data) {
      setQrscan(data);
      handleResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleResult = (result) => {
    if (result && result.text) {
      const { email } = JSON.parse(result.text);
      setShop((prevState) => ({
        ...prevState,
        email: email,
      }));
    }
  };

  const handleEnableReading = () => {
    setIsReadingEnabled(true);
  };

  const handlePurchaseAmountChange = (event) => {
    setShop((prevState) => ({
      ...prevState,
      purchaseAmount: event.target.value,
    }));
  };

  useEffect(() => {
    dispatch(getShop(_id));
  }, [dispatch, _id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const amount = parseFloat(purchaseAmount);
    const formData = {
      name: shop.name,
      email: email,
      purchaseAmount: amount,
    };
    console.log(formData);
    dispatch(purchaseQRCode(formData));
    if (
      shop.name &&
      email &&
      purchaseAmount &&
      shop.name.trim() !== "" &&
      email.trim() !== "" &&
      purchaseAmount.trim() !== ""
    ) {
      navigate(`/details-shop/${_id}`);
      setQrscan("No result");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-center items-center flex-col">
        {isLoading && <Loader />}
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <label htmlFor="name">Nome do Ponto de Venda:</label>
          <input
            type="text"
            id="name"
            value={shop.name}
            className="cursor-not-allowed"
            disabled
          />
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            className="cursor-not-allowed"
            disabled
          />
          <label htmlFor="purchaseAmount">Valor da compra:</label>
          <input
            type="text"
            id="purchaseAmount"
            value={purchaseAmount}
            onChange={handlePurchaseAmountChange}
          />
          <label>Aproxime o QRcode</label>
          <div className="flex justify-center border-4 border-indigo-900">
            <QrReader
              onError={handleError}
              onScan={handleScan}
              onLoad={handleEnableReading}
              className="w-full m-4"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium mt-10"
          >
            Realizar compra
          </button>
        </form>
      </div>
    </div>
  );
};

export default QrCodeReader;
