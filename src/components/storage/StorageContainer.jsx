import PropTypes from "prop-types";
import { SpinnerImg } from "../loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import styles from "../../pages/shop/shopDetails/ShopDetails.module.scss";
import { deleteItem, getItems } from "../../redux/features/items/itemsSlice";
import { useState } from "react";
import ReactPaginate from "react-paginate";

const StorageContainer = ({ item, isLoading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const delItem = async (itemId) => {
    await dispatch(deleteItem(itemId));
    await dispatch(getItems());
  };

  const confirmDeleteItem = (itemId) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Deseja deletar permanentemente este item?",
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
        navigate(`/storage`);
        Swal.fire({
          icon: "success",
          title: "Item Deletado!",
          text: "Item deletado com sucesso.",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "info",
          title: "Ação Cancelada!",
          text: "Não se preocupe, o item está seguro.",
        });
      }
    });
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = item?.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const showItemsPagination = item?.length > itemsPerPage;

  return (
    <div
      className={`${styles.items_list} flex justify-center items-center h-full flex-col`}
    >
      <div className="bg-slate-900 w-11/12 my-16 rounded-xl">
        <div className="flex justify-between items-center mx-10 my-7 sm:flex-col">
          <h3 className="text-2xl font-semibold">
            {" "}
            Inventário do{" "}
            <span className="text-violet-600 font-bold">Almoxarifado</span>
          </h3>
          {isLoading && <SpinnerImg />}
          <Link to="/add-item">
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-semibold hover:bg-violet-700 transition-colors duration-300 sm:mt-5">
              Adicionar Item
            </button>
          </Link>
        </div>
        <div className=" my-5 pt-6 border-t-2 border-indigo-500/50">
          <h3 className="text-xl font-semibold text-center">
            Itens em
            <span className="text-violet-600 font-bold"> Estoque</span>
          </h3>
          <div className={`${styles.table} m-5`}>
            {!isLoading && currentItems?.length === 0 ? (
              <p className="p-4 text-center">
                Nenhum item cadastrado. Por favor,{" "}
                <Link to="/add-item" className="hover:text-violet-500">
                  adicione um item
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
                      <th> Preço </th>
                      <th> Quantidade </th>
                      <th> Ações </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems?.map((item, index) => {
                      const { _id, name, price, quantity } = item;
                      const itemIndex = startIndex + index + 1;
                      return (
                        <tr
                          key={_id}
                          className="text-center hover:bg-slate-800 odd:bg-slate-900/80 even:bg-slate-900/20 "
                        >
                          <td className="py-2">{itemIndex}</td>
                          <td>{name}</td>
                          <td>R${price}</td>
                          <td>{quantity}</td>
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
                                onClick={() => confirmDeleteItem(_id)}
                                title="Deletar"
                              />
                              <Link to={`/edit-items/${_id}`}>
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
                {showItemsPagination && (
                  <ReactPaginate
                    previousLabel={"< Anterior"}
                    nextLabel={"Próximo >"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(item.length / itemsPerPage)}
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

StorageContainer.propTypes = {
  item: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  isLoading: PropTypes.bool,
};

export default StorageContainer;
