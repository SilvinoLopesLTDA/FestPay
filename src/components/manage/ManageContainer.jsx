import PropTypes from "prop-types";
import { useState } from "react";
import Loader from "../loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import styles from "../../pages/shop/shopDetails/ShopDetails.module.scss";
import {
  deleteSubaccounts,
  getSubaccounts,
} from "../../redux/features/auth/authSlice";
import ReactPaginate from "react-paginate";
// import PasswordCard from "../passwordCard/PasswordCard";

const ManageContainer = ({ subaccount, isLoading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const delSubAccount = async (id) => {
    await dispatch(deleteSubaccounts(id));
    await dispatch(getSubaccounts());
  };

  const confirmDeleteSubAccount = (adminId) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Deseja retirar permanentemente essa subconta?",
      icon: "warning",
      width: "50em",
      showCancelButton: true,
      confirmButtonColor: "#EF233C",
      cancelButtonColor: "#2B2D42",
      confirmButtonText: "Sim, Retirar",
      cancelButtonText: "Não, Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        delSubAccount(adminId);
        navigate(`/manage`);
        Swal.fire({
          icon: "success",
          title: "Subconta Retirada.",
          text: "Essa subconta foi retirada com sucesso!",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "info",
          title: "Ação Cancelada",
          text: "Não se preocupe, a subconta está segura!",
        });
      }
    });
  };

  const [activeTab, setActiveTab] = useState("admins");

  let admins = [];
  let workers = [];

  if (Array.isArray(subaccount)) {
    admins =
      subaccount.filter((subacc) => subacc && subacc.role === "admin") || [];
    workers =
      subaccount.filter((subacc) => subacc && subacc.role === "worker") || [];
  }

  // Pagination
  const [currentPageAdmins, setCurrentPageAdmins] = useState(0);
  const [currentPageWorkers, setCurrentPageWorkers] = useState(0);
  const itemsPerPage = 5;

  const handlePageClickAdmins = ({ selected }) => {
    setCurrentPageAdmins(selected);
  };

  const handlePageClickWorkers = ({ selected }) => {
    setCurrentPageWorkers(selected);
  };

  const startAdminIndex = currentPageAdmins * itemsPerPage;
  const startWorkerIndex = currentPageWorkers * itemsPerPage;

  const adminsToDisplay = admins.slice(
    currentPageAdmins * itemsPerPage,
    (currentPageAdmins + 1) * itemsPerPage
  );

  const workersToDisplay = workers.slice(
    currentPageWorkers * itemsPerPage,
    (currentPageWorkers + 1) * itemsPerPage
  );

  const showAdminsPagination = admins.length > itemsPerPage;

  const showWorkersPagination = workers.length > itemsPerPage;

  return (
    <>
      {/* <PasswordCard componentId="manage" password={"1234"} /> */}
      {isLoading && <Loader />}
      <div
        className={`${styles.items_list} flex justify-center items-center h-full flex-col`}
      >
        <div className="bg-slate-900 w-11/12 my-16 rounded-xl">
          <div className="flex justify-between items-center mx-10 my-7 sm:flex-col">
            <h3 className="text-2xl font-semibold">
              {" "}
              Controle de{" "}
              <span className="text-violet-600 font-bold">Subcontas</span>
            </h3>
            <div className="flex justify-center">
              <button
                className={`${
                  activeTab === "admins"
                    ? "bg-violet-800 hover:bg-violet-700"
                    : "bg-[#172035] hover:bg-[#1e2944]"
                } px-4 py-2 rounded-l-md font-medium transition-colors duration-300`}
                onClick={() => setActiveTab("admins")}
              >
                Administradores
              </button>
              <button
                className={`${
                  activeTab === "workers"
                    ? "bg-violet-800 hover:bg-violet-700"
                    : "bg-[#172035] hover:bg-[#1e2944]"
                } px-4 py-2 rounded-r-md font-medium transition-colors duration-300`}
                onClick={() => setActiveTab("workers")}
              >
                Trabalhadores
              </button>
            </div>
            <Link to="/add-subaccount">
              <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300 sm:mt-5">
                Adicionar Novo Membro
              </button>
            </Link>
          </div>
          <div className="my-5 border-t-2 border-indigo-500/50">
            {activeTab === "admins" && (
              <div className={`${styles.table} m-5`}>
                {admins.length === 0 ? (
                  <p className="p-4 text-center">
                    Nenhum administrador cadastrado. Por favor, adicione um
                    administrador!
                  </p>
                ) : (
                  <table className="bg-slate-950/75 w-full">
                    <thead>
                      <tr className="border-y border-indigo-500">
                        <th className="py-2"> s/n </th>
                        <th> Nome </th>
                        <th> Email </th>
                        <th> Ações </th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminsToDisplay.map((admin, index) => {
                        const { _id, name, email } = admin;
                        const adminIndex = startAdminIndex + index + 1;
                        return (
                          <tr
                            key={_id}
                            className="text-center hover:bg-slate-800 odd:bg-slate-900/80 even:bg-slate-900/20 "
                          >
                            <td className="py-2">{adminIndex}</td>
                            <td>{name}</td>
                            <td>{email}</td>
                            <td
                              className={`${styles.icons} flex justify-center align-center py-3`}
                            >
                              <span className="flex">
                                <FaTrashAlt
                                  style={{
                                    cursor: "pointer",
                                    marginRight: ".75rem",
                                  }}
                                  size={20}
                                  color="white"
                                  onClick={() => confirmDeleteSubAccount(_id)}
                                  title="Deletar"
                                />
                                <Link to={`/edit-admin/${_id}`}>
                                  <FaEdit
                                    size={22}
                                    color="white"
                                    title="Editar"
                                  />
                                </Link>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                {showAdminsPagination && (
                  <ReactPaginate
                    previousLabel={"< Anterior"}
                    nextLabel={"Próxima >"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(admins.length / itemsPerPage)}
                    onPageChange={handlePageClickAdmins}
                    containerClassName="pagination"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-num"
                    nextLinkClassName="page-num"
                    activeLinkClassName="activePage"
                  />
                )}
              </div>
            )}
            {activeTab === "workers" && (
              <div className={`${styles.table} m-5`}>
                {workers.length === 0 ? (
                  <p className="p-4 text-center">
                    Nenhum trabalhador cadastrado. Por favor, adicione um
                    trabalhador!
                  </p>
                ) : (
                  <table className="bg-slate-950/75 w-full">
                    <thead>
                      <tr className="border-y border-indigo-500">
                        <th className="py-2"> s/n </th>
                        <th> Nome </th>
                        <th> Email </th>
                        <th> Função </th>
                        <th> Ações </th>
                      </tr>
                    </thead>
                    <tbody>
                      {workersToDisplay.map((worker, index) => {
                        const { _id, name, email, workerFunction } = worker;
                        const workerIndex = startWorkerIndex + index + 1;
                        return (
                          <tr
                            key={_id}
                            className="text-center hover:bg-slate-800 odd:bg-slate-900/80 even:bg-slate-900/20 "
                          >
                            <td className="py-2">{workerIndex}</td>
                            <td>{name}</td>
                            <td>{email}</td>
                            <td>{workerFunction}</td>
                            <td
                              className={`${styles.icons} flex justify-center align-center py-3`}
                            >
                              <span className="flex">
                                <FaTrashAlt
                                  style={{
                                    cursor: "pointer",
                                    marginRight: ".75rem",
                                  }}
                                  size={20}
                                  color="white"
                                  onClick={() => confirmDeleteSubAccount(_id)}
                                  title="Deletar"
                                />
                                <Link to={`/edit-worker/${_id}`}>
                                  <FaEdit
                                    size={22}
                                    color="white"
                                    title="Editar"
                                  />
                                </Link>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                {showWorkersPagination && (
                  <ReactPaginate
                    previousLabel={"< Anterior"}
                    nextLabel={"Próxima >"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(workers.length / itemsPerPage)}
                    onPageChange={handlePageClickWorkers}
                    containerClassName="pagination"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-num"
                    nextLinkClassName="page-num"
                    activeLinkClassName="activePage"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

ManageContainer.propTypes = {
  subaccount: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isLoading: PropTypes.bool,
};

export default ManageContainer;
