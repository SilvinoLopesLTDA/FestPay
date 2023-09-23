import PropTypes from "prop-types";
import { SpinnerImg } from "../loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import styles from "../../pages/shop/shopDetails/ShopDetails.module.scss";
import { deleteItem, getItems } from "../../redux/features/items/itemsSlice";

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
      text: "Deseja deletar permanentemente esse item?",
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
          title: "Item Deletado",
          text: "Esse Item foi Deletado com sucesso!",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "info",
          title: "Ação Cancelada",
          text: "Não se preocupe, o item está seguro :)",
        });
      }
    });
  };

  return (
    <div
      className={`${styles.items_list} flex justify-center items-center h-full flex-col`}
    >
      <div className="bg-slate-900 w-11/12 my-16 rounded-xl">
        <div className="flex justify-between items-center mx-10 my-7 sm:flex-col">
          <h3 className="text-2xl font-semibold">
            {" "}
            Inventario do{" "}
            <span className="text-violet-700 font-bold">Almoxarifado</span>
          </h3>
          {isLoading && <SpinnerImg />}
          <Link to="/add-item">
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-semibold sm:mt-5">
              Adicionar Item
            </button>
          </Link>
        </div>
        <div className=" my-5 py-6 border-t-2 border-indigo-500/50">
          <h3 className="text-xl font-semibold text-center">
            Itens em
            <span className="text-violet-700 font-bold"> Estoque</span>
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
                        <td>{name}</td>
                        <td>{price}</td>
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
        </div>
      </div>
    </div>
  );
};

StorageContainer.propTypes = {
  item: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  isLoading: PropTypes.bool,
};

export default StorageContainer;
