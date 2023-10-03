import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../../redux/features/auth/authService";
import {
  SET_LOGIN,
  SET_USER,
  selectName,
} from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector(selectName);

  const handleLogout = async () => {
    await LogoutUser();
    dispatch(SET_LOGIN(false));
    localStorage.clear();
    navigate("/");
    dispatch(SET_USER(null));
  };

  return (
    <div className="px-10 pt-5">
      <div className="flex justify-between sm:flex-col">
        <h3 className="my-3 text-2xl sm:text-center">
          <span className="font-semibold">Bem vindo(a), </span>
          <span className="text-violet-600 font-bold">{name}</span>
          <span className="font-semibold">!</span>
        </h3>
        <button
          className="px-10 py-2 bg-violet-800 rounded text-lg font-medium hover:bg-violet-700 transition-colors duration-300 mb-5 mt-2"
          onClick={handleLogout}
        >
          Sair
        </button>
      </div>
      <hr />
    </div>
  );
};

export default Header;
