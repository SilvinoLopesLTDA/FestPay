import { Link } from "react-router-dom";
import PasswordCard from "../../components/passwordCard/PasswordCard";
import styles from "./Client.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../../components/loader/Loader";
import {
  createClient,
  selectIsLoading,
  selectClient,
} from "../../redux/features/client/clientSlice";
import FormClient from "../../components/forms/client/FormClient";
import { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useRedirectLoggedOutUser } from "../../customHook/useRedirectLoggedOutUser";
import PropTypes from "prop-types";

const initialState = {
  name: "",
  phone: "",
  email: "",
  paymentMethod: "",
  balance: "",
};

const QrCode = ({ handleCloseQrCode }) => {
  const clients = useSelector(selectClient);
  const client = clients[clients.length - 1];
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

  const handlePrintQRCode = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<div style="display: flex; justify-content: center; align-items: center; height: 95vh; font-family: sans-serif">
        <div style="background-color: #F3F4F6; border: 2px solid #E5E7EB; padding: 1rem; width: 400px;">
          <div style="text-align: center">
            <h1>FestPay</h1>
            <h3>QrCode do Cliente</h3>
            <hr />
            <h2>Nome: ${client?.name}</h2>
            <h3>Email: ${client?.email}</h3>
            <h3>Telefone: ${client?.phone}</h3>
          </div>
          <img src="${client?.qrCode}" alt="QR Code" style="width: 100%;" />
          <p style="font-size: 12px; text-align: center">*O estabelecimento não se responsabiliza em caso de perda ou roubo!</p>
        </div>
      </div>`
    );
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="fixed top-0 left-0 h-full w-full flex justify-center items-center bg-black/60">
      <div className="bg-slate-800 py-4 px-6 my-4 rounded w-3/12 sm:w-11/12">
        <button
          onClick={handleCloseQrCode}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-700"
        >
          <AiOutlineClose size={24} color="#94a3b8" />
        </button>
        <h1 className="text-xl text-center font-semibold mb-4">
          QrCode gerado com sucesso!
        </h1>
        <hr className="mb-4" />
        <h1 className="text-lg font-semibold mb-2">
          Nome do cliente: {client?.name}
        </h1>
        <h2 className="mb-2">Email do cliente: {client?.email}</h2>
        <h2 className="mb-2">Telefone do cliente: {client?.phone}</h2>
        <h2 className="mb-4">Valor da recarga: R$ {client?.balance}</h2>
        <img src={client?.qrCode} alt="QR Code" className="w-full" />
        <button
          className="px-3 py-2 mt-4 mb-2 w-full bg-violet-800 rounded-sm text-lg font-medium"
          onClick={handlePrintQRCode}
        >
          Imprimir QR Code
        </button>
      </div>
    </div>
  );
};

const Client = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [client, setClient] = useState(initialState);
  const [showQrCode, setShowQrCode] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("shouldReloadDashboard")) {
      window.location.reload();
      sessionStorage.removeItem("shouldReloadDashboard");
    }
  }, []);
  useRedirectLoggedOutUser("/login");

  const isLoading = useSelector(selectIsLoading);

  const { name, phone, email, paymentMethod, balance } = client;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const resetForm = () => {
    setClient(initialState);
  };

  const saveClient = async () => {
    const formData = {
      name: name,
      phone: phone,
      email: email,
      paymentMethod: paymentMethod,
      balance: balance,
    };
    try {
      const createdClient = await dispatch(createClient(formData));

      if (createClient.fulfilled.match(createdClient)) {
        setShowQrCode(true);
        resetForm();
        navigate("/clients");
      }
    } catch (error) {
      console.log("Erro ao criar cliente:", error);
      setShowQrCode(false);
    }
  };

  return (
    <>
      <PasswordCard componentId="client" password={"1234"} />
      <div className="flex justify-center items-center">
        {isLoading && <Loader />}
        <div className={styles.content}>
          <div className="flex justify-between mb-3 sm:flex-col">
            <h2 className="text-2xl font-semibold">
              Bem-vindo ao{" "}
              <span className="text-violet-700 font-bold">Guichê</span>
            </h2>
            <Link to="/add-balance">
              <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium sm:my-4 sm:w-full">
                Fazer Recarga
              </button>
            </Link>
          </div>
          <p className="mb-3 text-lg sm:text-center">
            {" "}
            - Adicione os dados do cliente abaixo{" "}
          </p>
          <FormClient
            client={client}
            handleInputChange={handleInputChange}
            saveClient={saveClient}
            resetForm={resetForm}
            required={"*"}
          />
          {showQrCode && (
            <div className="flex justify-center items-center mt-4">
              <div id="print-container">
                <QrCode handleCloseQrCode={() => setShowQrCode(false)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

QrCode.propTypes = {
  handleCloseQrCode: PropTypes.func,
};

export default Client;
