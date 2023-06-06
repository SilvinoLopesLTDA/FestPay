import { Link } from "react-router-dom";
import styles from "../Client.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../../../components/loader/Loader";
import {
  createClient,
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

  const { name, phone, email, paymentMethod, rechargeAmount } = client;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const saveClient = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("paymentMethod", paymentMethod);
    formData.append("rechargeAmount", rechargeAmount);

    await dispatch(createClient(formData));

    if (
      name &&
      phone &&
      email &&
      paymentMethod &&
      rechargeAmount &&
      name.trim() !== "" &&
      phone.trim() !== "" &&
      email.trim() !== "" &&
      paymentMethod.trim() !== "" &&
      rechargeAmount.trim() !== ""
    ) {
      navigate("/add-balance");
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
          <div className="flex justify-between mb-3">
            <h2 className="text-2xl font-semibold">
              Faça uma{" "}
              <span className="text-violet-700 font-bold">Recarga</span>
            </h2>
            <Link to="/clients">
              <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium">
                Voltar
              </button>
            </Link>
          </div>
          <p className="mb-3 text-lg">
            {" "}
            - Adicione os dados do cliente abaixo{" "}
          </p>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
              saveClient(e);
            }}
          >
            <label htmlFor="email"> Email </label>
            <input
              type="text"
              placeholder="email@gmail.com"
              name="email"
              id="email"
              value={client?.email}
              onChange={handleInputChange}
              className={
                isSubmitted && client?.email === "" ? `${styles.highlight}` : ""
              }
            />

            <label htmlFor="rechargeAmount"> Saldo </label>
            <input
              type="text"
              placeholder="10"
              name="rechargeAmount"
              id="rechargeAmount"
              value={client?.rechargeAmount}
              onChange={handleInputChange}
              className={
                isSubmitted && client?.rechargeAmount === ""
                  ? `${styles.highlight}`
                  : ""
              }
            />

            <label htmlFor="paymentMethod"> Metodo de Pagamento</label>
            <select name="paymentMethod" id="paymentMethod" className={isSubmitted && client?.email === "" ? `${styles.highlight}` : ""}>
              <option value="credit">Crédito</option>
              <option value="debit">Débito</option>
              <option value="money">Dinheiro</option>
              <option value="pix">Pix</option>
            </select>
            <button
              className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium mt-10"
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
