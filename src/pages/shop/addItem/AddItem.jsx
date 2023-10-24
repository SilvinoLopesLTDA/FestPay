import { useState, useEffect } from "react";
import { SpinnerImg } from "../../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import styles from "../shopDetails/ShopDetails.module.scss";
import {
  getItems,
  handleUserChoice,
} from "../../../redux/features/items/itemsSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getShop } from "../../../redux/features/shop/shopSlice";
import ReactPaginate from "react-paginate";

const AddItem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const itemState = useSelector((state) => state.items);
  const { item, isLoading, isError, message } = itemState || {};

  const [formData, setFormData] = useState(-1);

  useEffect(() => {
    dispatch(getItems());

    if (isError) {
      console.log(message);
    }
  }, [dispatch, isError, message]);

  const handleChoice = (index) => {
    setFormData(index);
  };

  useEffect(() => {
    if (formData !== -1) {
      dispatch(handleUserChoice({ id: id, selectedItemIndex: formData }));
      setFormData(-1);
      navigate(`/details-shop/${id}`);
    }
  }, [dispatch, formData, id, navigate]);

  const handleReturn = async () => {
    await dispatch(getShop(id));
    navigate(`/details-shop/${id}`);
  };

  // Paginate
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = item.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const showItemsPagination = item?.length > itemsPerPage;

  return (
    <div
      className={`${styles.items_list} flex justify-center items-center h-full flex-col`}
    >
      <div className="bg-slate-900 w-11/12 my-16 rounded-xl">
        <div className="flex justify-between items-center text-center mx-10 my-7 sm:flex-col">
          <h3 className="text-2xl font-semibold">
            Selecione um <span className="text-violet-600 font-bold">Item</span>
          </h3>
          {isLoading && <SpinnerImg />}
          <button
            className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300"
            onClick={handleReturn}
          >
            Voltar
          </button>
        </div>
        <div className="mt-5 py-6 border-t-2 border-indigo-500/50">
          <h3 className="text-lg text-center">
            Os itens abaixo são os que estão disponíveis no estoque!
          </h3>
          <div className="flex items-center justify-center">
            <hr className="my-5 w-2/4 border-indigo-500/80" />
          </div>
          <div className={`${styles.table} m-5`}>
            {!isLoading && currentItems?.length === 0 ? (
              <p className="p-4 pt-0 text-center">
                Nenhum item cadastrado. Por favor, adicione um item!
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
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems?.map((item, index) => {
                      const { _id, name, price, quantity } = item;
                      const itemIndex = startIndex + index + 1;
                      return (
                        <tr
                          key={_id + index}
                          onClick={() => handleChoice(_id)}
                          className={`text-center hover:bg-slate-800 odd:bg-slate-900/80 even:bg-slate-900/20 cursor-pointer ${
                            formData === index ? "bg-violet-700" : ""
                          }`}
                        >
                          <td className="py-2">{itemIndex}</td>
                          <td>{name}</td>
                          <td>R${price}</td>
                          <td>{quantity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {showItemsPagination && (
                  <ReactPaginate
                    previousLabel={"Anterior"}
                    nextLabel={"Próximo"}
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
          <div className="mt-5 text-center">
            <div className="flex items-center justify-center">
              <hr className="pb-4 w-3/4 border-indigo-500/80" />
            </div>
            <p className="opacity-80">
              Não encontrou o seu item?{" "}
              <Link to="/add-item" className="hover:text-violet-500">
                Cadastre mais produtos clicando aqui
              </Link>
              !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
