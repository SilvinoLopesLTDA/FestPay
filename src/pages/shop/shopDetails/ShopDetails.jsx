import Swal from "sweetalert2";
import { getShop } from "../../../redux/features/shop/shopSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { SpinnerImg } from "../../../components/loader/Loader";
import PasswordCard from "../../../components/passwordCard/PasswordCard";
import { deleteItem } from "../../../redux/features/shop/itemSlice";
import { BsPlus, BsQrCodeScan } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { AiOutlineMinus } from "react-icons/ai";
import styles from "./ShopDetails.module.scss";
import { format, isValid } from "date-fns";

const ShopDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { shop, isLoading, isError, message } = useSelector(
    (state) => state.shop
  );

  const location = useLocation();
  const showLoading = location.state?.showLoading || false;

  const item = shop?.items ?? [];

  const [quantityValues, setQuantityValues] = useState({});
  const [cart, setCart] = useState({ cart: [] });

  useEffect(() => {
    if (shop?.items) {
      const initialValues = {};
      shop.items.forEach((itemData) => {
        initialValues[itemData._id] = 0;
      });
      setQuantityValues(initialValues);
    }
  }, [shop?.items]);

  const CART_STORAGE_KEY = "cart_data";

  const getStoredCart = () => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : { cart: [] };
  };

  useEffect(() => {
    setCart(getStoredCart());
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const storedCart = getStoredCart();

    setCart((prevCart) => ({
      ...prevCart,
      cart: [...prevCart.cart, ...storedCart.cart],
    }));
  }, []);

  useEffect(() => {
    const storedCart = getStoredCart();
    setCart(storedCart);
  }, []);

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
    const itemId = itemData._id;

    const itemQuantInput = parseInt(quantityValues[itemId] || 0, 10);
    const itemValue = itemQuantInput * itemData.price;

    totalValue += itemValue;
    totalQuantity += itemQuantInput;
  });

  const created = new Date(shop.createdAt);
  const updated = new Date(shop.updatedAt);

  const createdFormatted = isValid(created)
    ? format(created, "dd/MM/yy - HH:mm")
    : "Data inválida";

  const updatedFormatted = isValid(updated)
    ? format(updated, "dd/MM/yy - HH:mm")
    : "Data inválida";

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

      setCart((prevCart) => {
        const existingCartItemIndex = prevCart.cart.findIndex(
          (item) => item.id === itemId
        );

        if (existingCartItemIndex !== -1) {
          const updatedCart = [...prevCart.cart];
          updatedCart[existingCartItemIndex].quantity = newQuantity;
          return { cart: updatedCart };
        } else {
          return {
            cart: [...prevCart.cart, { id: itemId, quantity: newQuantity }],
          };
        }
      });
    }
  };

  const decreaseQuantity = (itemId) => {
    setQuantityValues((prevValues) => {
      const currentQuantity = prevValues[itemId] || 0;
      const newQuantity = Math.max(0, currentQuantity - 1);

      setCart((prevCart) => {
        const updatedCart = (prevCart.cart || []).map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );

        const filteredCart = updatedCart.filter((item) => item.quantity > 0);

        return { ...prevCart, cart: filteredCart };
      });

      const updatedCart = {
        cart: cart.cart
          .map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
          .filter((item) => item.quantity > 0),
      };
      setCart(updatedCart);

      return {
        ...prevValues,
        [itemId]: newQuantity,
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
          {isLoading && showLoading && <SpinnerImg />}
          <div className="flex flex-between sm:flex-col">
            <div className="flex justify-center align-center flex-col float-left p-5 w-full">
              <h2 className="bg-slate-700 p-11 align-center text-3xl font-semibold text-center rounded">
                {shop.name}
              </h2>
            </div>
            <div className="flex text-center flex-col float-right px-5 text-white mt-5 sm:justify-center sm:text-center md:flex-row">
              <Link to={`/edit-shop/${id}`}>
                <button className="flex align-items justify-center w-full px-14 py-3 bg-indigo-800 rounded-sm text-lg font-semibold md:mt-0 sm:p-4 sm:justify-center">
                  <h2> Editar </h2>
                </button>
              </Link>
              <Link to={`/add-item/${id}`}>
                <button className="flex w-full px-14 py-3 bg-violet-900 rounded-sm text-lg font-semibold mt-5 md:mt-0 sm:ml-3 sm:p-4 sm:justify-center">
                  <h2 className="w-32">Adicionar Item</h2>
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
            {!isLoading && !showLoading && item?.length === 0 ? (
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
                          {quantity - quantityValues[_id]}
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
              {totalQuantity > 0 ? (
                <Link
                  to={"/buy-item"}
                  state={{
                    quantityValues: quantityValues,
                    cart: cart,
                    CART_STORAGE_KEY: CART_STORAGE_KEY,
                  }}
                >
                  <button className="flex text-lg font-medium p-2 bg-violet-700 rounded sm:px-14 sm:mt-2 sm:w-full sm:justify-center">
                    <BsQrCodeScan size={26} color="white" className="mr-2.5" />
                    Prosseguir à compra!
                  </button>
                </Link>
              ) : (
                <button
                  className="flex text-lg font-medium p-2 bg-violet-700 rounded sm:px-14 sm:mt-2 sm:w-full sm:justify-center cursor-not-allowed"
                  disabled
                >
                  Adicione um item para prosseguir!
                </button>
              )}
            </div>
            <div className="flex flex-col text-slate-500 p-6 text-sm font-medium">
              <code className="sm:my-6">Criado em: {createdFormatted}</code>
              <br />
              <code>Última Atualização: {updatedFormatted}</code>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopDetails;
