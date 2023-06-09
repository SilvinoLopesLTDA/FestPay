import Swal from "sweetalert2";
import {
  deleteShop,
  getShop,
  getShops,
} from "../../../redux/features/shop/shopSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { SpinnerImg } from "../../../components/loader/Loader";
import PasswordCard from "../../../components/passwordCard/PasswordCard";
import { getItems, updateItem } from "../../../redux/features/shop/itemSlice";
import QrCodeReader from "../../../components/qrCodeReader/qrCodeReader";

const ShopDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const { shop, isLoading, isError, message } = useSelector(
    (state) => state.shop
  );

  const { item } = useSelector((state) => state.item);

  // const itemTest = [
  //   {
  //     name: "teste",
  //     price: 121,
  //   },
  //   {
  //     name: "teste",
  //     price: 121,
  //   },
  //   {
  //     name: "teste",
  //     price: 121,
  //   },
  //   {
  //     name: "teste",
  //     price: 121,
  //   },
  // ];

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

  const delShop = async (id) => {
    await dispatch(deleteShop(id));
    await dispatch(getShops());
  };

  const confirmDelete = (id) => {
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
        delShop(id);
        navigate("/shops");
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

  const delItem = async (id) => {
    await dispatch(updateItem(id));
    await dispatch(getItems());
  };

  const confirmDeleteItem = (id) => {
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
        delItem(id);
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
      <PasswordCard password={shop.password} />
      <div className="flex justify-center items-center h-full flex-col">
        <div className="bg-slate-900 w-4/5 my-16">
          {isLoading && <SpinnerImg />}
          <div className="flex flex-between">
            <div className="flex justify-center align-center flex-col float-left p-5 w-full">
              <h2 className="bg-slate-700 p-9 align-center text-3xl font-semibold mb-5 text-center rounded">
                {shop.name}
              </h2>
              <div className="flex justify-around bg-slate-950/50 p-6">
                <p className="text-lg font-medium">
                  {" "}
                  Lucros:{" "}
                  <span className="text-green-500 font-bold text-2xl">
                    {"R$"}
                    {shop.profit}
                  </span>{" "}
                </p>
                <p className="text-lg font-medium ml-4">
                  {" "}
                  Custos:{" "}
                  <span className="text-rose-700 font-bold text-2xl">
                    {"R$"}
                    {shop.cost}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col float-right p-5 text-white">
              <Link to={`/edit-shop/${id}`}>
                <button className="flex px-24 py-3 bg-indigo-800 rounded-sm text-lg font-semibold">
                  <h2> Editar </h2>
                </button>
              </Link>
              <button
                onClick={() => confirmDelete(id)}
                className="flex px-20 py-3 bg-red-800 rounded-sm text-lg font-semibold mt-6"
              >
                <h2 className="px-2"> Deletar </h2>
              </button>
              <Link to={`/add-item/${id}`}>
                <button className="flex w-60 px-14 py-3 bg-violet-900 rounded-sm text-lg font-semibold mt-6">
                  <h2>Adicionar Item</h2>
                </button>
              </Link>
            </div>
          </div>

          <div>
            <QrCodeReader />
          </div>

          <div className="px-5 py-2 w-full text-center">
            <h2 className="text-3xl font-semibold"> Itens da Barraca </h2>
          </div>

          <div className="m-5">
            {!isLoading && item.length === 0 ? (
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
                  {item.map((item, index) => {
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

          <div className="flex flex-col p-5 text-slate-500 border-t border-slate-800">
            <code className="font-medium">
              Criado em: {created.toLocaleString("pt-BR")}
            </code>
            <br />
            <code className="font-medium">
              Ultima Atualização: {updated.toLocaleString("pt-BR")}
            </code>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopDetails;
