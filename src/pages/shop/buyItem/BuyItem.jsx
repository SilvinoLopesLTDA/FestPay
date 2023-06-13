import { useSelector } from "react-redux";
import QrCodeReader from "../../../components/qrCodeReader/qrCodeReader";
import Loader from "../../../components/loader/Loader";
import { Link, useParams } from "react-router-dom";
import styles from "../../../pages/client/Client.module.scss";

const BuyItem = () => {
  const { id } = useParams();
  const { isLoading } = useSelector((state) => state.shop);

  return (
    <div className="flex justify-center items-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between mb-3">
          <h2 className="text-2xl font-semibold">
            Bem-vindo ao{" "}
            <span className="text-violet-700 font-bold">Caixa</span>
          </h2>
          <Link to={`/details-shop/${id}`}>
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium">
              Voltar
            </button>
          </Link>
        </div>
        <p className="mb-3 text-lg"> - Adicione os dados do cliente abaixo </p>
        <QrCodeReader />
      </div>
    </div>
  );
};

export default BuyItem;
