import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../../services/authService";
import { SET_LOGIN, selectName } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector(selectName);

  const Logout = async () => {
    await LogoutUser();
    await dispatch(SET_LOGIN(false));
    navigate("/");
  };

  return (
    <div className="px-10 pt-5">
      <div className="flex justify-between sm:flex-col">
        <h3 className="my-3 text-2xl sm:text-center">
          <span className="font-semibold">Bem vindo(a) de volta, </span>
          <span className="text-violet-500 font-bold"> {name} </span>
          <span className="font-semibold">!</span>
        </h3>
        <button
          className="px-10 py-2 text-lg font-semibold rounded-lg bg-violet-700 mb-5 mt-2"
          onClick={Logout}
        >
          Sair
        </button>
      </div>
      <hr />
    </div>
  );
};

export default Header;
