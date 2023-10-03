import { useSelector } from "react-redux";
import QrCodeReader from "../../../components/qrCodeReader/qrCodeReader";
import Loader from "../../../components/loader/Loader";
import { Link, useLocation } from "react-router-dom";
import styles from "../../../pages/client/Client.module.scss";

const BuyItem = () => {
  const { shop, isLoading } = useSelector((state) => state.shop);
  let { state } = useLocation();
  const quantityValues = state.quantityValues;
  const cart = state.cart
  const CART_STORAGE_KEY = state.CART_STORAGE_KEY
  const { _id } = shop;

  return (
    <div className="flex justify-center items-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between mb-3 items-center">
          <h2 className="text-2xl font-semibold">
            Bem-vindo ao{" "}
            <span className="text-violet-600 font-bold">
              Caixa de Pagamento
            </span>
          </h2>
          <Link to={`/details-shop/${_id}`}>
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300">
              Voltar
            </button>
          </Link>
        </div>
        <p className="mb-3 text-lg">
          {" "}
          - Confira os dados do pagamento e do cliente logo abaixo{" "}
        </p>
        <QrCodeReader quantityValues={quantityValues} cart={cart} CART_STORAGE_KEY={CART_STORAGE_KEY} />
      </div>
    </div>
  );
};

export default BuyItem;
