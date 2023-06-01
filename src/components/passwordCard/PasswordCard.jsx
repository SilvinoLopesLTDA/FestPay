import { useState } from "react";
import OtpInput from "react-otp-input";
import styles from "./PasswordCard.module.scss";
import { MdOutlinePassword } from "react-icons/md";
import PropTypes from "prop-types"

const PasswordCard = ({password}) => {
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(true);

  const handlePassword = () => {
    if (otp === password) {
      setShowOTP(false);
    } else {
      setOtp("");
    }
  };

  const handleClear = () => {
    setOtp("");
  };

  return (
    <>
      {showOTP && (
        <div className={`${styles.wrapper} flex items-center`}>
          <div className={styles.container}>
            <MdOutlinePassword size={28} className="text-violet-700" />
            <h4 className="text-2xl font-semibold mb-6">
              {" "}
              Confirme a <span className="text-violet-700">Senha</span>{" "}
            </h4>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              renderInput={(props) => <input {...props} />}
              inputStyle={"mx-3 text-5xl text-violet-800 rounded"}
            />
            <div
              className={`${styles.btn_action} flex space-x-10 mt-8 text-md`}
            >
              <button
                className="bg-slate-700 px-3 py-1 rounded-sm"
                onClick={handleClear}
              >
                {" "}
                Limpar{" "}
              </button>
              <button
                className="bg-violet-900 px-3 py-1 rounded-sm"
                onClick={handlePassword}
              >
                {" "}
                Entrar{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

PasswordCard.propTypes = {
    password: PropTypes.string.isRequired,
  };

export default PasswordCard;
