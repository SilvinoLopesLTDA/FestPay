// import { useState } from "react";
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
} from "../../redux/features/clientSlice";

const initialState = {
  name: "",
  phone: "",
  email: "",
  paymentMethod: "",
  balance: "",
};

const Client = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [client, setClient] = useState(initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isLoading = useSelector(selectIsLoading);

  const { name, phone, email, paymentMethod, balance } = client;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const saveClient = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("paymentMethod", paymentMethod);
    formData.append("balance", balance);

    await dispatch(createClient(formData));

    if (
      name &&
      phone &&
      email &&
      paymentMethod &&
      balance &&
      name.trim() !== "" &&
      phone.trim() !== "" &&
      email.trim() !== "" &&
      paymentMethod.trim() !== "" &&
      balance.trim() !== ""
    ) {
      navigate("/clients");
    }
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
      navigate("/clients");
    } else {
      navigate("/clients");
    }
  };

  return (
    <>
      <PasswordCard password={"1234"} />
      <div className="flex justify-center items-center">
        {isLoading && <Loader />}
        <div className={styles.content}>
          <div className="flex justify-between mb-3">
            <h2 className="text-2xl font-semibold">
              Bem-vindo ao{" "}
              <span className="text-violet-700 font-bold">Guichê</span>
            </h2>
            <Link to="/add-balance">
              <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium">
                Fazer Recarga
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
            <label htmlFor="name"> Nome </label>
            <input
              type="text"
              placeholder="Matheus..."
              name="name"
              id="name"
              value={client?.name}
              onChange={handleInputChange}
              className={
                isSubmitted && client?.name === "" ? `${styles.highlight}` : ""
              }
            />

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

            <label htmlFor="phone"> Tel </label>
            <input
              type="text"
              placeholder="+55 61 99409-2521"
              name="phone"
              id="phone"
              value={client?.phone}
              onChange={handleInputChange}
              className={
                isSubmitted && client?.phone === "" ? `${styles.highlight}` : ""
              }
            />

            <label htmlFor="balance"> Saldo </label>
            <input
              type="text"
              placeholder="10"
              name="balance"
              id="balance"
              value={client?.balance}
              onChange={handleInputChange}
              className={
                isSubmitted && client?.balance === ""
                  ? `${styles.highlight}`
                  : ""
              }
            />

            <label htmlFor="paymentMethod"> Metodo de Pagamento</label>
            <select name="paymentMethod" id="paymentMethod">
              <option value="credit">Crédito</option>
              <option value="debit">Débito</option>
              <option value="money">Dinheiro</option>
              <option value="pix">Pix</option>
            </select>
          </form>
          <button
            className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium mt-10"
            type="submit"
            onClick={saveClient}
          >
            {" "}
            Criar Cliente
          </button>
        </div>
      </div>
    </>
  );
};

export default Client;
