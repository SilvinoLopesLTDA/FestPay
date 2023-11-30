import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserAccount,
  selectIsLoading,
  selectSubaccounts,
} from "../../../redux/features/auth/authSlice";
import { addWorker, getShop } from "../../../redux/features/shop/shopSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import styles from "../shopDetails/ShopDetails.module.scss";
import { SpinnerImg } from "../../../components/loader/Loader";
import { format, isValid } from "date-fns";
import { toast } from "react-toastify";

const AddWorker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedWorkerIds, setSelectedWorkerIds] = useState([]);
  const assignedWorkerIds = useSelector((state) => state.shop.shop.workers);
  const subaccounts = useSelector(selectSubaccounts);
  const isLoading = useSelector(selectIsLoading);
  const { id } = useParams();

  useEffect(() => {
    dispatch(getUserAccount());

    setSelectedWorkerIds(assignedWorkerIds);
  }, [dispatch, assignedWorkerIds]);

  const handleWorkerSelection = (workerId) => {
    if (assignedWorkerIds.includes(workerId)) {
      toast.error("Este trabalhador já está atribuído a uma barraca.");
      return;
    }

    if (selectedWorkerIds.includes(workerId)) {
      setSelectedWorkerIds(selectedWorkerIds.filter((id) => id !== workerId));
    } else {
      setSelectedWorkerIds([...selectedWorkerIds, workerId]);
    }
  };

  const handleAssignWorkers = async () => {
    if (selectedWorkerIds.length === 0) {
      toast.error("Por favor, selecione ao menos um trabalhador!");
      return;
    }

    await dispatch(addWorker({ id: id, workers: selectedWorkerIds }));
    navigate(`/details-shop/${id}`);
  };

  const handleReturn = async () => {
    await dispatch(getShop(id));
    navigate(`/details-shop/${id}`);
  };

  const workersWithBarracaFunction = subaccounts.filter((worker) => {
    return worker.workerFunction === "Barraca";
  });

  const [currentPage, setCurrentPage] = useState(0);
  const subaccountsPerPage = 5;
  const startIndex = currentPage * subaccountsPerPage;
  const endIndex = startIndex + subaccountsPerPage;
  const currentSubaccounts = workersWithBarracaFunction.slice(
    startIndex,
    endIndex
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const showSubaccountsPagination =
    workersWithBarracaFunction?.length > subaccountsPerPage;

  return (
    <div
      className={`${styles.items_list} flex justify-center items-center h-full flex-col`}
    >
      <div className="bg-slate-900 w-11/12 my-16 rounded-xl">
        <div className="flex justify-between items-center text-center mx-10 my-7 sm:flex-col">
          <h3 className="text-2xl font-semibold">
            Selecione um{" "}
            <span className="text-violet-600 font-bold">Trabalhador</span>
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
            Os trabalhadores abaixo são os que estão cadastrados no seu evento!
          </h3>
          <div className="flex items-center justify-center">
            <hr className="my-5 w-3/4 border-indigo-500/80" />
          </div>
          <div className={`${styles.table} m-5`}>
            {!isLoading && currentSubaccounts?.length === 0 ? (
              <p className="p-4 pt-0 text-center">
                Nenhum trabalhador cadastrado. Por favor, cadastre um
                trabalhador!
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
                      <th> Selecione o Trabalhador </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSubaccounts?.map((worker, index) => {
                      const { _id, name, email, createdAt } = worker;
                      const clientIndex = startIndex + index + 1;
                      const created = new Date(createdAt);
                      const createdFormated = isValid(created)
                        ? format(created, "dd/MM/yyyy")
                        : "Data inválida";
                      const isSelected = selectedWorkerIds.includes(_id);
                      const isAssigned = assignedWorkerIds.includes(_id);
                      return (
                        <tr
                          key={_id + index}
                          className={`text-center hover:bg-slate-800 odd-bg-slate-900/80 even-bg-slate-900/20 cursor-pointer ${
                            isAssigned ? "opacity-50 pointer-events-none" : ""
                          }`}
                          onClick={() => {
                            handleWorkerSelection(_id);
                          }}
                        >
                          <td className="py-2">{clientIndex}</td>
                          <td>{name}</td>
                          <td>{email}</td>
                          <td>{createdFormated}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                handleWorkerSelection(_id);
                              }}
                              className="cursor-pointer"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <button
                  className="flex justify-center align-center mx-auto mt-5 px-6 py-2 bg-violet-800 rounded-sm text-lg font-medium hover-bg-violet-700 transition-colors duration-300"
                  onClick={handleAssignWorkers}
                >
                  Atribuir Trabalhadores
                </button>
                {showSubaccountsPagination && (
                  <ReactPaginate
                    previousLabel={"Anterior"}
                    nextLabel={"Próximo"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(
                      subaccounts.length / subaccountsPerPage
                    )}
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
              Não encontrou o trabalhador desejado?{" "}
              <Link to="/add-subaccount" className="hover:text-violet-500">
                Cadastre mais trabalhadores clicando aqui
              </Link>
              !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWorker;
