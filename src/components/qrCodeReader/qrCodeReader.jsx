import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import QrReader from "react-qr-scanner";
import Loader from "../loader/Loader";
import {
  getShop,
  purchaseQRCode,
  registerPurchase,
  selectIsLoading,
} from "../../redux/features/shop/shopSlice";
import { useNavigate } from "react-router-dom";
import { purchaseItem } from "../../redux/features/shop/itemSlice";
import { toast } from "react-toastify";
import {
  getClients,
  selectClient,
} from "../../redux/features/client/clientSlice";

const initialState = {
  email: "",
};

const QrCodeReader = ({ quantityValues, cart }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [, setQrscan] = useState("Sem Resultados");
  const [isReadingEnabled, setIsReadingEnabled] = useState(true);
  const [shopInitial, setShop] = useState(initialState);
  const isLoading = useSelector(selectIsLoading);
  const clients = useSelector(selectClient);
  const { shop } = useSelector((state) => state.shop);
  const { _id } = shop;
  let totalValue = 0;
  const item = shop?.items ?? [];
  item.forEach((itemData) => {
    const itemQuantInput = parseInt(quantityValues[itemData._id] || 0, 10);
    const itemValue = itemQuantInput * itemData.price;
    totalValue += itemValue;
  });

  const updateItemQuantities = async () => {
    const updatedItems = item
      .map((itemData) => ({
        itemId: itemData._id,
        quantity: itemData.quantity - (quantityValues[itemData._id] || 0),
      }))
      .filter((itemData) => itemData.quantity > 0);

    const cartData = {
      cart: updatedItems,
    };

    await dispatch(purchaseItem({ shopId: _id, cartData }));
  };

  const { email } = shopInitial;

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

  useEffect(() => {
    dispatch(getShop(_id));
  }, [dispatch, _id]);

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const clientWithEmail = clients.find((client) => client.email === email);
    console.log(clientWithEmail);
    if (
      clientWithEmail &&
      parseFloat(totalValue) <= parseFloat(clientWithEmail.balance)
    ) {
      const formData = {
        name: shop?.name,
        email: email,
        purchaseAmount: totalValue,
      };

      dispatch(purchaseQRCode(formData));
      dispatch(registerPurchase({ id: _id, cart }));
      if (email && email.trim() !== "") {
        updateItemQuantities();
        navigate(`/details-shop/${_id}`);
        setQrscan("No result");
      }
    } else {
      toast.error("Saldo insuficiente para a compra!");
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
            value={shop?.name}
            className="cursor-not-allowed"
            disabled
          />

          <label htmlFor="purchaseAmount">Valor da compra:</label>
          <input
            type="text"
            id="purchaseAmount"
            value={`R$ ${totalValue}`}
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

QrCodeReader.propTypes = {
  quantityValues: PropTypes.object.isRequired,
  cart: PropTypes.array,
};

export default QrCodeReader;
