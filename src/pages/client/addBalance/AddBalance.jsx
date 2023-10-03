import { Link } from "react-router-dom";
import styles from "../Client.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../../../components/loader/Loader";
import {
  rechargeClient,
  selectIsLoading,
} from "../../../redux/features/client/clientSlice";

const initialState = {
  email: "",
  paymentMethod: "",
  rechargeAmount: "",
};

const Client = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [client, setClient] = useState(initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isLoading = useSelector(selectIsLoading);

  const { email, paymentMethod, rechargeAmount } = client;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };
  console.log(client);

  const saveClient = async () => {
    event.preventDefault();
    const amount = parseFloat(rechargeAmount);
    const formData = {
      email: email,
      paymentMethod: paymentMethod,
      rechargeAmount: amount,
    };
    console.log(formData);
    await dispatch(rechargeClient(formData));

    if (
      email &&
      paymentMethod &&
      rechargeAmount &&
      email.trim() !== "" &&
      paymentMethod.trim() !== "" &&
      rechargeAmount.trim() !== ""
    ) {
      navigate("/clients");
    }
  };

  const saveClientData = () => {
    const clientData = {
      ...client,
    };

    saveClient(clientData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      client.name &&
      client.category &&
      client.cost &&
      client.price &&
      client.quantity
    ) {
      saveClient(client);
      navigate("/add-balance");
    } else {
      navigate("/add-balance");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        {isLoading && <Loader />}
        <div className={styles.content}>
          <div className="flex justify-between mb-3 items-center">
            <h2 className="text-2xl font-semibold">
              Faça uma{" "}
              <span className="text-violet-600 font-bold">Recarga</span>
            </h2>
            <Link to="/clients">
              <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300 sm:mt-2">
                Voltar
              </button>
            </Link>
          </div>
          <p className="mb-3 text-lg sm:mt-5">
            {" "}
            - Insira os dados do cliente abaixo{" "}
          </p>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
              saveClient(e);
            }}
          >
            <label htmlFor="email">
              {" "}
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Digite o email do cliente..."
              name="email"
              id="email"
              value={client.email}
              onChange={handleInputChange}
              className={
                isSubmitted && client.email === "" ? `${styles.highlight}` : ""
              }
              required
            />

            <label htmlFor="rechargeAmount">
              {" "}
              Saldo <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Digite a quantidade da recarga..."
              name="rechargeAmount"
              id="rechargeAmount"
              value={client.rechargeAmount}
              onChange={handleInputChange}
              className={
                isSubmitted && client.rechargeAmount === ""
                  ? `${styles.highlight}`
                  : ""
              }
              required
            />
            <label htmlFor="paymentMethod">
              {" "}
              Metodo de Pagamento <span className="text-red-600">*</span>
            </label>
            <select
              name="paymentMethod"
              id="paymentMethod"
              className={
                isSubmitted && client.paymentMethod === ""
                  ? `${styles.highlight}`
                  : ""
              }
              value={client.paymentMethod}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione um método de pagamento</option>
              <option value="Crédito">Crédito</option>
              <option value="Débito">Débito</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Pix">Pix</option>
            </select>
            <button
              className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium mt-10 hover:bg-violet-700 transition-colors duration-300"
              type="submit"
              onClick={saveClientData}
            >
              {" "}
              Fazer Recarga
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Client;
