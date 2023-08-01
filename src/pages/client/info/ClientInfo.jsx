import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerImg } from "../../../components/loader/Loader";
import { useEffect } from "react";
import { getClientInfo } from "../../../redux/features/client/clientSlice";
import { useParams } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";

const QrCode = ({ client, handleCloseQrCode }) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        handleCloseQrCode();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleCloseQrCode]);

  return (
    <div className="fixed top-0 left-0 h-full w-full flex justify-center items-center bg-black/60">
      <div className="bg-slate-800 py-4 px-6 my-4 rounded w-3/12 sm:w-11/12">
        <button
          onClick={handleCloseQrCode}
          className="relative left-[93%] mb-2"
        >
          <AiOutlineClose size={30} color="#94a3b8" />
        </button>
        <img src={client.qrCode} alt="QR Code" className="w-full" />
      </div>
    </div>
  );
};

const ClientInfo = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { client, isLoading, isError, message } = useSelector(
    (state) => state.client
  );

  const [showQrCode, setShowQrCode] = useState(false);

  const handleShowQrCode = () => {
    setShowQrCode(true);
  };

  useEffect(() => {
    dispatch(getClientInfo(id));

    if (isError) {
      console.log(message);
    }
  }, [dispatch, id, isError, message]);

  const formattedBalance = (balance) => {
    const formattedValue = (balance ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formattedValue;
  };

  const formattedPhoneNumber = (phoneNumber) => {
    const formattedValue = (phoneNumber ?? "").replace(
      /(\d{2})(\d{5})(\d{4})/,
      "($1) $2-$3"
    );
    return formattedValue;
  };

  return (
    <div className="flex justify-center items-center h-full flex-col text-white">
      <div className="bg-slate-900 w-4/5 my-10 rounded-xl sm:w-11/12 sm:w-full sm:h-screen sm:m-0 sm:rounded-none">
        {isLoading && <SpinnerImg />}
        <div className="flex justify-center items-center flex-col w-full">
          <div className="bg-indigo-900 rounded-lg mx-10 my-7 p-5 w-11/12 text-center">
            <h3 className="text-xl font-medium">
              Saldo FestPay
              <p className="text-4xl mt-3">
                <span className="font-semibold">
                  {formattedBalance(client?.balance)}
                </span>
              </p>
            </h3>
            <h3 className="mt-5 font-semibold text-md text-slate-300">
              Como ter mais créditos?
              <p className="font-medium">
                Visite o caixa mais próximo para inserir mais créditos
              </p>
            </h3>
          </div>
        </div>
        <div className="flex justify-center items-center flex-col">
          <h2 className="text-lg text-center py-5 w-11/12 border-y-2 border-indigo-500">
            Seja bem-vindo(a) ao FestPay,{" "}
            <span className="text-violet-600 font-semibold">
              {client.name}!
            </span>
          </h2>
          <div className="w-11/12 mt-5">
            <h3 className="text-violet-500 font-semibold">
              {" "}
              Última Forma de Pagamento Utilizada
            </h3>
            <p className="bg-slate-700 py-4 px-6 my-4 rounded">
              {client.paymentMethod}
            </p>
          </div>

          <div className="w-11/12 mt-5 mb-2">
            <div className="flex justify-between">
              <h3 className="text-violet-500 font-semibold">
                Detalhes da Conta
              </h3>
              <button
                className="px-7 py-2 text-md font-semibold rounded bg-violet-700"
                onClick={handleShowQrCode}
              >
                Exibir QrCode
              </button>
            </div>
            {showQrCode && (
              <QrCode
                client={client}
                handleCloseQrCode={() => setShowQrCode(false)}
              />
            )}
            <p className="bg-slate-700 py-4 px-6 my-4 rounded">
              {client.email}
            </p>
            <p className="bg-slate-700 py-4 px-6 my-4 rounded">
              {formattedPhoneNumber(client.phone)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

QrCode.propTypes = {
  client: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleCloseQrCode: PropTypes.func,
};

export default ClientInfo;
