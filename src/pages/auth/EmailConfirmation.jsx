import { useEffect, useCallback } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { confirmateEmail } from "../../redux/features/auth/authService";

const EmailConfirmation = () => {
  const { confirmationToken } = useParams();
  const [confirmationStatus, setConfirmationStatus] = useState("Confirming");
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  const confirmEmailAndNavigate = useCallback(async () => {
    await confirmateEmail(confirmationToken);
    setConfirmationStatus("Confirmed");
    setTimeout(() => {
      navigate("/login");
    }, countdown * 1000);
  }, [confirmationToken, countdown, navigate]);

  useEffect(() => {
    confirmEmailAndNavigate();

    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [confirmEmailAndNavigate, countdown]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950">
      <div className="bg-[#0f172a] p-8 rounded shadow-md">
        <h2 className="text-2xl text-center text-gray-100 font-bold mb-4">
          Confirmação de E-mail
        </h2>
        <hr />
        {confirmationStatus === "Confirming" && (
          <p className="text-gray-200 text-center mt-4">
            Confirmando o seu e-mail. Aguarde...
          </p>
        )}
        {confirmationStatus === "Confirmed" && (
          <div>
            <p className="text-gray-200 text-center text-xl mt-4 mb-6">
              Seu e-mail foi confirmado com sucesso!
            </p>
            <p className="text-gray-200 text-center mt-4">
              Você pode{" "}
              <Link to="/login" className="hover:text-violet-600">
                fazer login
              </Link>{" "}
              agora ou esperar {countdown} segundos para ser redirecionado
              automaticamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation;
