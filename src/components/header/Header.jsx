import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const Logout = () => {
    navigate("/");
  };

  return (
    <div className="px-10 pt-5 header">
      <div className="flex justify-between">
        <h3 className="my-3 text-2xl">
          <span className="font-semibold">Bem vindo(a) de volta, </span>
          <span className="text-violet-500 font-bold"> User_Placeholder </span>
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
