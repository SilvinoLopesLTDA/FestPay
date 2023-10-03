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
      resetForm();
      navigate("/clients");
      setIsSubmitted(false);
    } else {
      console.log("Preencha os campos corretamente!");
    }
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
          placeholder="Digite o nome do cliente..."
          name="name"
          id="name"
          value={client.name}
          onChange={handleInputChange}
          className={
            isSubmitted && client.name === "" ? `${styles.highlight}` : ""
          }
          required
        />

        <label htmlFor="email">
          {" "}
          Email <span className="text-red-600">{required}</span>
        </label>
        <input
          type="email"
          placeholder="Digite o email do cliente..."
          name="email"
          id="email"
          value={client.email}
          onChange={handleInputChange}
          className={
            isSubmitted && client.email === "" ? `${styles.highlight}` : ""
          }
          required
          pattern="\S+@\S+\.\S+"
        />

        <label htmlFor="phone">
          {" "}
          Telefone <span className="text-red-600">{required}</span>
        </label>
        <input
          type="tel"
          placeholder="Digite o número de telefone do cliente..."
          name="phone"
          id="phone"
          value={client.phone}
          onChange={handlePhoneInputChange}
          className={
            isSubmitted && client.phone === "" ? `${styles.highlight}` : ""
          }
          required
          inputMode="numeric"
          maxLength="15"
        />

        <label htmlFor="balance">
          {" "}
          Saldo <span className="text-red-600">{required}</span>
        </label>
        <input
          type="text"
          placeholder="Digite o saldo que o cliente deseja..."
          name="balance"
          id="balance"
          value={client?.balance}
          onChange={handleBalanceInputChange}
          className={
            isSubmitted && client?.balance === "" ? `${styles.highlight}` : ""
          }
          required
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
          required
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
          className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300 mt-10"
          type="submit"
        >
          {" "}
          Criar Cliente
        </button>
      </form>
    </div>
  );
};

FormClient.propTypes = {
  client: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleInputChange: PropTypes.func,
  saveClient: PropTypes.func,
  resetForm: PropTypes.func,
  required: PropTypes.string,
};

export default FormClient;
