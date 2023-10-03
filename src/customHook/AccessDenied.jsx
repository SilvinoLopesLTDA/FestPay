import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-950">
      <div className="bg-[#0f172a] p-8 rounded shadow-md">
        <h1 className="text-2xl text-gray-100 font-bold mb-4">Acesso Negado</h1>
        <hr />
        <p className="text-gray-200 mt-4 mb-6">
          Desculpe, você não tem permissão para acessar esta página.
        </p>
        <Link
          to="/home"
          className="bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded"
        >
          Voltar à Página Inicial
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
