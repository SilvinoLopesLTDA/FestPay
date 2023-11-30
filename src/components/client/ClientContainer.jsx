import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteClient,
  getClients,
} from "../../redux/features/client/clientSlice";
import Swal from "sweetalert2";
import { useState } from "react";
import Loader from "../loader/Loader";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import styles from "../../pages/shop/shopDetails/ShopDetails.module.scss";
import ReactPaginate from "react-paginate";
import { format, isValid } from "date-fns";

const ClientContainer = ({ clients, isLoading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const delItem = async (clientId) => {
    await dispatch(deleteClient(clientId));
    await dispatch(getClients());
  };

  const confirmDeleteClient = (itemId) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Deseja deletar permanentemente este cliente?",
      icon: "warning",
      width: "50em",
      showCancelButton: true,
      confirmButtonColor: "#EF233C",
      cancelButtonColor: "#2B2D42",
      confirmButtonText: "Sim, Deletar",
      cancelButtonText: "Não, Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        delItem(itemId);
        navigate(`/clients`);
        Swal.fire({
          icon: "success",
          title: "Cliente Deletado!",
          text: "Cliente deletado com sucesso.",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "info",
          title: "Ação Cancelada!",
          text: "Não se preocupe, o cliente está seguro.",
        });
      }
    });
  };

  const [currentPage, setCurrentPage] = useState(0);
  const clientsPerPage = 10;
  const startIndex = currentPage * clientsPerPage;
  const endIndex = startIndex + clientsPerPage;
  const currentClients = clients.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const showClientsPagination = clients.length > clientsPerPage;

  return (
    <div
      className={`${styles.items_list} flex justify-center items-center h-full flex-col`}
    >
      <div className="bg-slate-900 w-11/12 my-16 rounded-xl">
        <div className="flex justify-between items-center mx-10 my-7 sm:flex-col">
          <h3 className="text-2xl font-semibold">
            {" "}
            Lista dos{" "}
            <span className="text-violet-600 font-bold">Clientes</span>
          </h3>
          {isLoading && <Loader />}
          <Link to="/ticket-window">
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-semibold hover:bg-violet-700 transition-colors duration-300 sm:mt-5">
              Cadastrar Cliente
            </button>
          </Link>
        </div>
        <div className=" my-5 pt-6 border-t-2 border-indigo-500/50">
          <h3 className="text-xl font-semibold text-center">
            Clientes
            <span className="text-violet-600 font-bold"> Cadastrados</span>
          </h3>
          <div className={`${styles.table} m-5`}>
            {!isLoading && currentClients.length === 0 ? (
              <p className="p-4 text-center">
                Nenhum cliente cadastrado. Por favor,{" "}
                <Link to="/ticket-window" className="hover:text-violet-500">
                  cadastre um cliente
                </Link>
                !
              </p>
            ) : (
              <>
                <table className="bg-slate-950/75 w-full">
                  <thead>
                    <tr className="border-y border-indigo-500">
                      <th className="py-2"> s/n </th>
                      <th> Nome </th>
                      <th> Email </th>
                      <th> Telefone </th>
                      <th> Cliente desde: </th>
                      <th> Ações </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentClients.map((client, index) => {
                      const { _id, name, email, phone, createdAt } = client;
                      const created = new Date(createdAt);
                      const createdFormated = isValid(created)
                        ? format(created, "dd/MM/yyyy")
                        : "Data inválida";
                      const clientIndex = startIndex + index + 1;
                      return (
                        <tr
                          key={_id}
                          className="text-center hover:bg-slate-800 odd:bg-slate-900/80 even:bg-slate-900/20 "
                        >
                          <td className="py-2">{clientIndex}</td>
                          <td>{name}</td>
                          <td>{email}</td>
                          <td>{phone}</td>
                          <td>{createdFormated}</td>
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
                                onClick={() => confirmDeleteClient(_id)}
                                title="Deletar"
                              />
                              <Link to={`/edit-client/${_id}`}>
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
                {showClientsPagination && (
                  <ReactPaginate
                    previousLabel={"< Anterior"}
                    nextLabel={"Próximo >"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(clients.length / clientsPerPage)}
                    onPageChange={handlePageChange}
                    containerClassName="pagination"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-num"
                    nextLinkClassName="page-num"
                    activeLinkClassName="activePage"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ClientContainer.propTypes = {
  clients: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isLoading: PropTypes.bool,
};

export default ClientContainer;
