import { useState, useEffect } from "react";
import { SpinnerImg } from "../../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import styles from "../shopDetails/ShopDetails.module.scss";
import {
  getItems,
  handleUserChoice,
} from "../../../redux/features/items/itemsSlice";
import { useNavigate, useParams } from "react-router-dom";
import { getShop } from "../../../redux/features/shop/shopSlice";

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
      dispatch(handleUserChoice(id, formData));
      setFormData(-1);
      navigate(`/details-shop/${id}`);
    }
  }, [dispatch, formData, id, navigate]);

  console.log(formData);

  const handleReturn = async () => {
    await dispatch(getShop(id));
    navigate(`/details-shop/${id}`);
  };

  return (
    <div
      className={`${styles.items_list} flex justify-center items-center h-full flex-col`}
    >
      <div className="bg-slate-900 w-11/12 my-16 rounded-xl">
        <div className="flex justify-between items-center text-center mx-10 my-7 sm:flex-col">
          <h3 className="text-2xl font-semibold">
            Selecione um <span className="text-violet-700 font-bold">Item</span>
          </h3>
          {isLoading && <SpinnerImg />}
          <button
            className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium"
            onClick={handleReturn}
          >
            Voltar
          </button>
        </div>
        <div className="my-5 py-6 border-t-2 border-indigo-500/50">
          <h3 className="text-lg text-center">
            Os Itens abaixo são os que estão disponíveis no estoque
          </h3>
          <div className={`${styles.table} m-5`}>
            {!isLoading && item?.length === 0 ? (
              <p className="p-4 text-center">
                Nenhum item cadastrado. Por favor, adicione um item!
              </p>
            ) : (
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
                  {item?.map((item, index) => {
                    const { _id, name, price, quantity } = item;
                    return (
                      <tr
                        key={_id}
                        onClick={() => handleChoice(index)}
                        className={`text-center hover:bg-slate-800 odd:bg-slate-900/80 even:bg-slate-900/20 cursor-pointer ${
                          formData === index ? "bg-violet-700" : ""
                        }`}
                      >
                        <td className="py-2">{index + 1}</td>
                        <td>{name}</td>
                        <td>{price}</td>
                        <td>{quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
