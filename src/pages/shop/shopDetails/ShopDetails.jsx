import Swal from "sweetalert2";
import { getShop } from "../../../redux/features/shop/shopSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { SpinnerImg } from "../../../components/loader/Loader";
import PasswordCard from "../../../components/passwordCard/PasswordCard";
import { deleteItem } from "../../../redux/features/shop/itemSlice";
import { BsQrCodeScan } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";

const ShopDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const { shop, isLoading, isError, message } = useSelector(
    (state) => state.shop
  );

  const item = shop.items;

  const created = new Date(shop.createdAt);
  const updated = new Date(shop.updatedAt);

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
    await dispatch(getShop(id)); // Buscar o shop atualizado após a exclusão do item
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
          title: "Item Excluido",
          text: "Esse item foi excluida com sucesso!",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "info",
          title: "Ação Cancelada",
          text: "Não se preocupe, seu item está securo :)",
        });
      }
    });
  };

  return (
    <>
      <PasswordCard componentId={shop.name} password={shop.password} />
      <div className="flex justify-center items-center h-full flex-col ">
        <div className="bg-slate-900 w-4/5 my-16 sm:flex sm:flex-col">
          {isLoading && <SpinnerImg />}
          <div className="flex flex-between sm:flex-col">
            <div className="flex justify-center align-center flex-col float-left p-5 w-full">
              <h2 className="bg-slate-700 p-11 align-center text-3xl font-semibold mb-5 text-center rounded">
                {shop.name}
              </h2>
            </div>
            <div className="flex flex-col float-right p-5 text-white sm:flex-row sm:justify-center">
              <Link to={`/edit-shop/${id}`}>
                <button className="flex px-24 py-3 bg-indigo-800 rounded-sm text-lg font-semibold sm:p-4">
                  <FaEdit
                    size={22}
                    color="white"
                    title="Editar"
                    className="ml-1 lg:hidden"
                  />
                  <h2 className="sm:hidden"> Editar </h2>
                </button>
              </Link>
              <Link to={`/add-item/${id}`}>
                <button className="flex w-full px-14 py-3 bg-violet-900 rounded-sm text-lg font-semibold mt-5 sm:p-4 sm:mt-0">
                  <MdAddShoppingCart
                    size={20}
                    color="white"
                    title="Editar"
                    className="ml-1 lg:hidden"
                  />
                  <h2 className="sm:hidden">Adicionar Item</h2>
                </button>
              </Link>
            </div>
          </div>
          <div className="px-5 py-2 w-full text-center">
            <h2 className="text-3xl font-semibold sm:text-2xl">
              {" "}
              Itens da Barraca{" "}
            </h2>
          </div>

          <div className="m-5">
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
                    <th> Ações </th>
                  </tr>
                </thead>
                <tbody>
                  {item?.map((item, index) => {
                    const { _id, name, price } = item;
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
                        <td className="flex justify-center align-center py-3">
                          <FaTrashAlt
                            style={{ cursor: "pointer" }}
                            size={20}
                            color="white"
                            onClick={() => confirmDeleteItem(_id)}
                            title="Deletar"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-between p-5 border-t border-slate-800">
            <div className="flex flex-col text-slate-500 text-sm font-medium">
              <code>Criado em: {created.toLocaleString("pt-BR")}</code>
              <br />
              <code>Ultima Atualização: {updated.toLocaleString("pt-BR")}</code>
            </div>
            <div className="flex justify-around bg-slate-950/50 p-6 sm:w-full sm:flex-col sm:text-center">
              <Link to="/buyitem">
                <button className="flex text-lg font-medium p-2 bg-violet-700 rounded sm:px-14 sm:mt-2">
                  <BsQrCodeScan size={25} color="white" />
                  <p> Escanear</p>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopDetails;
