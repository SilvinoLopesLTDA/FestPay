import Swal from "sweetalert2";
import { getShop } from "../../../redux/features/shop/shopSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { SpinnerImg } from "../../../components/loader/Loader";
import PasswordCard from "../../../components/passwordCard/PasswordCard";
import { deleteItem } from "../../../redux/features/shop/itemSlice";
import { BsPlus, BsQrCodeScan } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import { AiOutlineMinus } from "react-icons/ai";
import styles from "./ShopDetails.module.scss";

const ShopDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { shop, isLoading, isError, message } = useSelector(
    (state) => state.shop
  );

  const item = shop?.items ?? [];

  const [quantityValues, setQuantityValues] = useState(() => {
    const initialValues = {};
    item.forEach((itemData) => {
      initialValues[itemData._id] = 0;
    });
    return initialValues;
  });

  const formatNumber = (number) => {
    if (number === null || number === undefined || isNaN(number)) {
      return "0";
    }

    const formattedNumber = Number(number).toFixed(2).toString();

    const parts = formattedNumber.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1];

    let formattedIntegerPart = "";
    for (let i = 0; i < integerPart.length; i++) {
      formattedIntegerPart += integerPart[i];
      const remainingDigits = integerPart.length - (i + 1);
      if (remainingDigits > 0 && remainingDigits % 3 === 0) {
        formattedIntegerPart += ".";
      }
    }

    return ` ${formattedIntegerPart},${decimalPart}`;
  };

  let totalValue = 0;
  let totalQuantity = 0;

  item.forEach((itemData) => {
    const itemQuantInput = parseInt(quantityValues[itemData._id] || 0, 10);
    const itemValue = itemQuantInput * itemData.price;

    totalValue += itemValue;
    totalQuantity += itemQuantInput;
  });

  const created = new Date(shop.createdAt);
  const updated = new Date(shop.updatedAt);

  const increaseQuantity = (itemId) => {
    const itemData = item.find((item) => item._id === itemId);
    if (!itemData) return;

    const currentQuantity = quantityValues[itemId] || 0;
    const newQuantity = currentQuantity + 1;

    if (newQuantity <= itemData.quantity) {
      setQuantityValues((prevValues) => ({
        ...prevValues,
        [itemId]: newQuantity,
      }));
    }
  };

  const decreaseQuantity = (itemId) => {
    setQuantityValues((prevValues) => {
      const currentQuantity = prevValues[itemId] || 0;
      return {
        ...prevValues,
        [itemId]: Math.max(0, currentQuantity - 1),
      };
    });
  };

  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };

  useEffect(() => {
    dispatch(getShop(id));

    if (isError) {
      console.log(message);
    }
  }, [dispatch, id, isError, message]);

  const delItem = async (itemId) => {
    await dispatch(deleteItem(itemId));
    await dispatch(getShop(id));
  };

  const confirmDeleteItem = (itemId) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Deseja excluir permanentemente esse item?",
      icon: "warning",
      width: "50em",
      showCancelButton: true,
      confirmButtonColor: "#EF233C",
      cancelButtonColor: "#2B2D42",
      confirmButtonText: "Sim, Excluir",
      cancelButtonText: "Não, Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        delItem(itemId);
        navigate(`/details-shop/${id}`);
        Swal.fire({
          icon: "success",
          title: "Item Excluído",
          text: "Esse item foi excluído com sucesso!",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "info",
          title: "Ação Cancelada",
          text: "Não se preocupe, seu item está seguro :)",
        });
      }
    });
  };

  return (
    <>
      <PasswordCard componentId={shop.name} password={shop.password} />
      <div
        className={` ${styles.items_list} flex justify-center items-center h-full flex-col `}
      >
        <div className="bg-slate-900 w-11/12 my-16 sm:flex sm:flex-col">
          {isLoading && <SpinnerImg />}
          <div className="flex flex-between sm:flex-col">
            <div className="flex justify-center align-center flex-col float-left p-5 w-full">
              <h2 className="bg-slate-700 p-11 align-center text-3xl font-semibold text-center rounded">
                {shop.name}
              </h2>
            </div>
            <div className="flex flex-col float-right px-5 text-white mt-5 sm:justify-center sm:text-center md:flex-row">
              <Link to={`/edit-shop/${id}`}>
                <button className="flex px-24 py-3 bg-indigo-800 rounded-sm text-lg font-semibold sm:p-5 sm:justify-center">
                  <FaEdit
                    size={22}
                    color="white"
                    title="Editar"
                    className="lg:hidden"
                  />
                  <h2 className="sm:hidden"> Editar </h2>
                </button>
              </Link>
              <Link to={`/add-item/${id}`}>
                <button className="flex w-full px-14 py-3 bg-violet-900 rounded-sm text-lg font-semibold mt-5 md:mt-0 sm:ml-3 sm:p-4 sm:justify-center">
                  <MdAddShoppingCart
                    size={20}
                    color="white"
                    title="Editar"
                    className="mr-3 mt-1 lg:hidden"
                  />
                  <h2>Adicionar Item</h2>
                </button>
              </Link>
            </div>
          </div>
          <div className="px-5 py-2 w-full text-center mt-7">
            <h2 className="text-3xl font-semibold sm:text-2xl">
              Itens da Barraca
            </h2>
          </div>

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
                    <th> Quant. </th>
                    <th> Quant. Compra </th>
                    <th> Ações </th>
                  </tr>
                </thead>
                <tbody>
                  {item?.map((item, index) => {
                    const { _id, name, price, quantity } = item;
                    return (
                      <tr
                        key={_id}
                        className="text-center hover:bg-slate-800 odd:bg-slate-900/80 even:bg-slate-900/20 "
                      >
                        <td className="py-2">{index + 1}</td>
                        <td>{shortenText(name)}</td>
                        <td>
                          {"R$"}
                          {price}
                        </td>
                        <td className={quantity <= 5 ? `${styles.low}` : ""}>
                          {quantity}
                        </td>
                        <td className="w-12">
                          <div className="flex justify-center">
                            <button
                              className="p-1 mr-3 bg-indigo-700 text-white-950"
                              onClick={() => decreaseQuantity(_id)}
                            >
                              <AiOutlineMinus color="white" size={25} />
                            </button>
                            <input
                              type="text"
                              disabled
                              min={0}
                              value={quantityValues[_id] || 0}
                              onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                setQuantityValues((prevValues) => ({
                                  ...prevValues,
                                  [_id]: value >= 0 ? value : 0,
                                }));
                              }}
                              className="text-center w-32"
                            />
                            <button
                              className="p-1 ml-3 bg-indigo-700 text-white-950"
                              onClick={() => increaseQuantity(_id)}
                            >
                              <BsPlus color="white" size={25} />
                            </button>
                          </div>
                        </td>
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
                            <Link to={`/edit-item/${_id}`} state={{ id: id }}>
                              <FaEdit size={22} color="white" title="Editar" />
                            </Link>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-between p-5 border-t border-slate-800 sm:flex-col">
            <div className="flex items-center justify-around bg-slate-950/50 rounded w-90 p-6 sm:w-full sm:flex-col sm:text-center">
              <span className="text-lg flex mt-1 sm:flex-col">
                <p>
                  Valor Total:{" "}
                  <span className="text-indigo-600/75 font-bold">
                    R${formatNumber(totalValue)}
                  </span>
                </p>
                <p className="mx-4 sm:my-5">
                  Quant. Itens:{" "}
                  <span className="text-indigo-400 font-bold">
                    {totalQuantity || 0}
                  </span>
                </p>
              </span>
              <Link to={"/buy-item"} state={{ quantityValues: quantityValues }}>
                <button className="flex text-lg font-medium p-2 bg-violet-700 rounded sm:px-14 sm:mt-2 sm:w-full sm:justify-center">
                  <BsQrCodeScan size={25} color="white" />
                </button>
              </Link>
            </div>
            <div className="flex flex-col text-slate-500 p-6 text-sm font-medium">
              <code className="sm:my-6">
                Criado em: {created.toLocaleString("pt-BR")}
              </code>
              <br />
              <code>Última Atualização: {updated.toLocaleString("pt-BR")}</code>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopDetails;
