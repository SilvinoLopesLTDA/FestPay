import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import Loader from "../loader/Loader";
import {
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
  const [, setQrscan] = useState("No result");
  const [isReadingEnabled, setIsReadingEnabled] = useState(true);
  const [shopInitial, setShop] = useState(initialState);
  const isLoading = useSelector(selectIsLoading);
  const { id } = useParams();
  const { shop } = useSelector((state) => state.shop);
  const { email, purchaseAmount } = shopInitial;

  const handleScan = (data) => {
    if (isReadingEnabled && data) {
      setQrscan(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleResult = (result) => {
    console.log(result);
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
      navigate(`/details-shop/${id}`);
      setQrscan("No result");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        {isLoading && <Loader />}
        <div>
          <div style={{ height: 250, width: 250 }}>
            <QrReader
              onError={handleError}
              onScan={handleScan}
              onResult={handleResult}
              onLoad={handleEnableReading}
              style={{ height: 200, width: 200 }}
            />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <p>Name: {shop.name}</p>
          <p>Email: {email}</p>
          <label>
            Valor da compra:
            <input
              type="text"
              value={purchaseAmount}
              onChange={handlePurchaseAmountChange}
            />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default QrCodeReader;
