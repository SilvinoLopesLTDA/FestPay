import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../../pages/client/Client.module.scss";

const FormClient = ({ client, handleInputChange, saveClient, resetForm, required }) => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      client.name &&
      client.phone &&
      client.email &&
      client.paymentMethod &&
      client.balance
    ) {
      saveClient(client);
      resetForm();
      navigate("/clients");
    } else {
      navigate("/clients");
    }
  };

  const saveClientData = () => {
    const clientData = {
      ...client,
    };
    saveClient(JSON.stringify(clientData));
  };

  return (
    <div>
      <form
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
          saveClient(e);
        }}
      >
        <label htmlFor="name">
          {" "}
          Nome <span className="text-red-600">{required}</span>
        </label>
        <input
          type="text"
          placeholder="Matheus..."
          name="name"
          id="name"
          value={client.name}
          onChange={handleInputChange}
          className={
            isSubmitted && client.name === "" ? `${styles.highlight}` : ""
          }
        />

        <label htmlFor="email">
          {" "}
          Email <span className="text-red-600">{required}</span>
        </label>
        <input
          type="text"
          placeholder="email@gmail.com"
          name="email"
          id="email"
          value={client.email}
          onChange={handleInputChange}
          className={
            isSubmitted && client.email === "" ? `${styles.highlight}` : ""
          }
        />

        <label htmlFor="phone">
          {" "}
          Tel <span className="text-red-600">{required}</span>
        </label>
        <input
          type="text"
          placeholder="+55 00 91234-5678"
          name="phone"
          id="phone"
          value={client.phone}
          onChange={handleInputChange}
          className={
            isSubmitted && client.phone === "" ? `${styles.highlight}` : ""
          }
        />

        <label htmlFor="balance">
          {" "}
          Saldo <span className="text-red-600">{required}</span>
        </label>
        <input
          type="text"
          placeholder="10"
          name="balance"
          id="balance"
          value={client?.balance}
          onChange={handleInputChange}
          className={
            isSubmitted && client?.balance === "" ? `${styles.highlight}` : ""
          }
        />

        <label htmlFor="paymentMethod">
          Método de Pagamento <span className="text-red-600">{required}</span>
        </label>
        <select
          name="paymentMethod"
          id="paymentMethod"
          className={
            isSubmitted && client.name === "" ? `${styles.highlight}` : ""
          }
          value={client.paymentMethod}
          onChange={handleInputChange}
        >
          <option value="">Selecione um método de pagamento</option>
          <option value="Crédito">Crédito</option>
          <option value="Débito">Débito</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Pix">Pix</option>
        </select>
        <button
          className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium mt-10"
          type="submit"
          onClick={saveClientData}
        >
          {" "}
          Criar Cliente
        </button>
      </form>
    </div>
  );
};

FormClient.propTypes = {
  client: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  saveClient: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  required: PropTypes.string.isRequired,
};

export default FormClient;
