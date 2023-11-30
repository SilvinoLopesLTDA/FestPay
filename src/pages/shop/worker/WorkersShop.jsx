import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserAccount,
  selectIsLoading,
  selectSubaccounts,
} from "../../../redux/features/auth/authSlice";
import { getShop, removeWorker } from "../../../redux/features/shop/shopSlice";
import { useNavigate, useParams } from "react-router-dom";
import { format, isValid } from "date-fns";
import styles from "../shopDetails/ShopDetails.module.scss";
import { SpinnerImg } from "../../../components/loader/Loader";
import ReactPaginate from "react-paginate";

const WorkersShop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const assignedWorkerIds = useSelector((state) => state.shop.shop.workers);
  const subaccounts = useSelector(selectSubaccounts);
  const isLoading = useSelector(selectIsLoading);
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    dispatch(getUserAccount());
    dispatch(getShop(id));
  }, [dispatch, id]);

  const toggleWorkerSelection = (workerId) => {
    if (workers.includes(workerId)) {
      setWorkers(workers.filter((id) => id !== workerId));
    } else {
      setWorkers([...workers, workerId]);
    }
  };

  const unassignSelectedWorkers = async () => {
    if (workers.length === 0) {
      return;
    }

    await dispatch(removeWorker({ id, workers }));
    await dispatch(getShop(id));
    setWorkers([]);
  };

  const workersListed = subaccounts.filter((worker) => {
    return assignedWorkerIds.includes(worker._id);
  });

  const [currentPage, setCurrentPage] = useState(0);
  const subaccountsPerPage = 5;
  const startIndex = currentPage * subaccountsPerPage;
  const endIndex = startIndex + subaccountsPerPage;
  const currentSubaccounts = workersListed.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const showSubaccountsPagination = workersListed?.length > subaccountsPerPage;

  return (
    <div
      className={`${styles.items_list} flex justify-center items-center h-full flex-col`}
    >
      <div className="bg-slate-900 w-11/12 my-16 rounded-xl">
        <div className="flex justify-between items-center text-center mx-10 my-7 sm:flex-col">
          <h3 className="text-2xl font-semibold">
            Trabalhadores Atribuídos à{" "}
            <span className="text-violet-600 font-bold">Barraca</span>
          </h3>
          {isLoading && <SpinnerImg />}
          <button
            className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300"
            onClick={() => navigate(`/details-shop/${id}`)}
          >
            Voltar
          </button>
        </div>
        <div className="mt-5 py-6 border-t-2 border-indigo-500/50">
          <h3 className="text-lg text-center">
            Aqui estão os trabalhadores atribuídos à sua barraca:
          </h3>
          <div className="flex items-center justify-center">
            <hr className="my-5 w-3/4 border-indigo-500/80" />
          </div>
          <div className={`${styles.table} m-5`}>
            {currentSubaccounts.length === 0 ? (
              <p className="p-4 pt-0 text-center">
                Nenhum trabalhador atribuído a esta barraca.
              </p>
            ) : (
              <>
                <table className="bg-slate-950/75 w-full">
                  <thead>
                    <tr className="border-y border-indigo-500">
                      <th className="py-2"> s/n </th>
                      <th> Nome </th>
                      <th> Email </th>
                      <th> Funcionário Desde </th>
                      <th> Desatribuir Trabalhador </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSubaccounts.map((worker, index) => {
                      const { _id, name, email, createdAt } = worker;
                      const clientIndex = startIndex + index + 1;
                      const created = new Date(createdAt);
                      const createdFormated = isValid(created)
                        ? format(created, "dd/MM/yyyy")
                        : "Data inválida";
                      const isSelected = workers.includes(_id);

                      return (
                        <tr
                          key={_id}
                          className="text-center hover:bg-slate-800 odd-bg-slate-900/80 even-bg-slate-900/20"
                        >
                          <td className="py-2">{clientIndex}</td>
                          <td>{name}</td>
                          <td>{email}</td>
                          <td>{createdFormated}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleWorkerSelection(_id)}
                              className="cursor-pointer"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {showSubaccountsPagination && (
                  <ReactPaginate
                    previousLabel={"Anterior"}
                    nextLabel={"Próximo"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(
                      workersListed.length / subaccountsPerPage
                    )}
                    onPageChange={handlePageChange}
                    containerClassName="pagination"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-num"
                    nextLinkClassName="page-num"
                    activeLinkClassName="activePage"
                  />
                )}
                <button
                  className="flex justify-center align-center mx-auto mt-5 px-6 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300"
                  onClick={unassignSelectedWorkers}
                >
                  Desatribuir Trabalhadores
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkersShop;
