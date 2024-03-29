import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import styles from "./PasswordCard.module.scss";
import { MdOutlinePassword } from "react-icons/md";
import PropTypes from "prop-types";

const PasswordCard = ({ password, componentId }) => {
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const handlePassword = () => {
    if (otp === password) {
      setShowOTP(false);
      const currentTime = new Date().getTime();
      localStorage.setItem(
        `${componentId}_passwordValidUntil`,
        currentTime + 12 * 60 * 60 * 1000
      );
    } else {
      setOtp("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handlePassword();
    } else if (event.key === "Backspace") {
      setOtp((prevOtp) => prevOtp.slice(0, -1));
    }
  };

  const handleClear = () => {
    setOtp("");
  };

  const handleInputChange = (value) => {
    const sanitizedValue = value.replace(/\D/g, "");
    setOtp(sanitizedValue);
  };

  useEffect(() => {
    const passwordValidUntil = localStorage.getItem(
      `${componentId}_passwordValidUntil`
    );
    if (passwordValidUntil) {
      const currentTime = new Date().getTime();
      if (currentTime < parseInt(passwordValidUntil)) {
        setIsPasswordValid(true);
        setShowOTP(false);
      } else {
        setIsPasswordValid(false);
        setShowOTP(true);
        localStorage.removeItem(`${componentId}_passwordValidUntil`);
      }
    }
  }, [componentId]);

  return (
    <>
      {showOTP && (
        <div className={`${styles.wrapper} flex items-center`}>
          <div className={styles.container}>
            <MdOutlinePassword size={28} className="text-violet-700" />
            {!showOTP && !isPasswordValid && (
              <div className="text-center">
                <p>A senha expirou. Por favor, insira novamente.</p>
              </div>
            )}
            <h4 className="text-2xl font-semibold mb-6">
              Confirme a <span className="text-violet-700">Senha</span>
            </h4>
            <OtpInput
              value={otp}
              onChange={handleInputChange}
              numInputs={4}
              renderInput={(props) => (
                <input
                  {...props}
                  type="number"
                  onKeyDown={handleKeyDown}
                  inputMode="tel"
                />
              )}
              inputStyle={`mx-3 text-5xl text-violet-800 rounded sm:text-4xl`}
              inputMode="tel"
            />
            <div
              className={`${styles.btn_action} flex space-x-10 mt-8 text-md`}
            >
              <button
                className="bg-slate-700 px-3 py-1 rounded-sm"
                onClick={handleClear}
              >
                Limpar
              </button>
              <button
                className="bg-violet-900 px-3 py-1 rounded-sm"
                onClick={handlePassword}
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

PasswordCard.propTypes = {
  password: PropTypes.string,
  componentId: PropTypes.string,
};

export default PasswordCard;
