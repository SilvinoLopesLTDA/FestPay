import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "../../../pages/client/Client.module.scss";

const FormClient = ({
  client,
  handleInputChange,
  saveClient,
  resetForm,
  required,
}) => {
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

  const handlePhoneInputChange = (e) => {
    const rawPhoneNumber = e.target.value.replace(/[^\d]/g, "");
    const formattedPhoneNumber = rawPhoneNumber.replace(
      /^(\d{2})(\d{4,5})(\d{4})$/,
      "($1) $2-$3"
    );
    handleInputChange({
      target: {
        name: "phone",
        value: formattedPhoneNumber,
      },
    });
  };

  const handleBalanceInputChange = (e) => {
    const balanceValue = e.target.value.replace(/[^\d,.]/g, "");

    const formattedBalance = balanceValue.replace(/,/g, ".");

    const dotIndex = formattedBalance.indexOf(".");
    const hasMultipleDots =
      dotIndex !== -1 && dotIndex !== formattedBalance.lastIndexOf(".");
    if (hasMultipleDots) {
      return;
    }

    handleInputChange({
      target: {
        name: "balance",
        value: formattedBalance,
      },
    });
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
          type="email"
          placeholder="email@gmail.com"
          name="email"
          id="email"
          value={client.email}
          onChange={handleInputChange}
          className={
            isSubmitted && client.email === "" ? `${styles.highlight}` : ""
          }
          pattern="\S+@\S+\.\S+"
        />

        <label htmlFor="phone">
          {" "}
          Telefone <span className="text-red-600">{required}</span>
        </label>
        <input
          type="tel"
          placeholder="(00) 91234-5678"
          name="phone"
          id="phone"
          pattern="([0-9]{2})[0-9]{5}-[0-9]{4}"
          value={client.phone}
          onChange={handlePhoneInputChange}
          className={
            isSubmitted && client.phone === "" ? `${styles.highlight}` : ""
          }
          inputMode="numeric"
          maxLength="15"
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
          onChange={handleBalanceInputChange}
          className={
            isSubmitted && client?.balance === "" ? `${styles.highlight}` : ""
          }
          inputMode="numeric"
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
