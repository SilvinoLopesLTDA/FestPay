import PropTypes from "prop-types";
import { SpinnerImg } from "../../loader/Loader";
import ShopCard from "../shopCard/ShopCard";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { selectIsLoading } from "../../../redux/features/shop/shopSlice";

const ShopContainer = ({ shop }) => {
  const isLoading = useSelector(selectIsLoading);

  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 12;
  const indexOfLastCard = (currentPage + 1) * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = shop?.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const showShopsPagination = shop?.length > cardsPerPage;

  return (
    <div className="flex justify-center items-center h-full flex-col">
      <div className="bg-slate-900 w-11/12 my-16 rounded-xl">
        <div className="flex justify-between items-center mx-10 my-7 sm:flex-col">
          <h3 className="text-2xl font-semibold">
            Pontos de <span className="text-violet-600 font-bold">Vendas</span>
          </h3>
          {isLoading && <SpinnerImg />}
          <Link to="/add-shop">
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300 sm:mt-5">
              Adicionar Barraca
            </button>
          </Link>
        </div>

        <div className="my-5 py-1 border-t-2 border-indigo-500/50">
          <div className="mx-5">
            {currentCards?.length === 0 ? (
              <p className="p-4 text-center">
                Nenhuma barraca cadastrada. Por favor, adicione uma barraca!
              </p>
            ) : (
              <>
                <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentCards?.map((shopItem, index) => (
                    <ShopCard
                      key={index}
                      id={shopItem._id}
                      name={shopItem.name}
                    />
                  ))}
                </div>
                {showShopsPagination && (
                  <ReactPaginate
                    previousLabel={"< Anterior"}
                    nextLabel={"Próxima >"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(shop.length / cardsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
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

ShopContainer.propTypes = {
  shop: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default ShopContainer;
