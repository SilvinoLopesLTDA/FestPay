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
} from "../../redux/features/client/clientSlice";
import FormClient from "../../components/forms/client/FormClient";

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

  const isLoading = useSelector(selectIsLoading);

  const { name, phone, email, paymentMethod, balance } = client;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const saveClient = async () => {
    event.preventDefault();
    const formData = {
      name: name,
      phone: phone,
      email: email,
      paymentMethod: paymentMethod,
      balance: balance,
    };
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
          <FormClient
            client={client}
            handleInputChange={handleInputChange}
            saveClient={saveClient}
            required={"*"}
          />
        </div>
      </div>
    </>
  );
};

export default Client;
