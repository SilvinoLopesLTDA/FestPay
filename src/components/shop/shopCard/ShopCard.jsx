import PropTypes from "prop-types";
import { SpinnerImg } from "../../loader/Loader";
import styles from "./ShopCard.module.scss";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { deleteShop, getShops } from "../../../redux/features/shop/shopSlice";

const ShopCard = ({ shop, isLoading }) => {
  const dispatch = useDispatch();
  const currentItems = Array.isArray(shop) ? shop : [];

  const delShop = async (id) => {
    await dispatch(deleteShop(id));
    await dispatch(getShops());
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Deseja excluir permanentemente esse item do estoque?",
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
        Swal.fire({
          icon: "success",
          title: "Item Excluido",
          text: "o Item de seu estoque foi deletado com sucesso!",
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
    <div className={`${styles.cardContainer} grid grid-cols-3 gap place-items-center flex-wrap h-full my-8`}>
      {isLoading && <SpinnerImg />}
      {!isLoading && shop.length === 0 ? (
        <p className={styles.placeholder}>
          -- Nenhum ponto de venda cadastrado. Por favor, adicione um Ponto de
          venda!
        </p>
      ) : (
        currentItems.map((shop) => {
          const { _id, name} = shop;
          return (
            <div key={_id} className="bg-slate-950/50 drop-shadow-4xl w-10/12 p-5 my-5 rounded">
              <h2 className="bg-slate-900 p-2 text-lg font-semibold mb-5">{name}</h2>
              <div className={`${styles.icons} flex justify-around`}>
                  <Link to={`/details-shop/${_id}`}>
                    <AiOutlineEye size={25} color="#42a15b" title="Detalhes" />
                  </Link>
                  <Link to={`/edit-shop/${_id}`}>
                    <FaEdit size={20} color="#2937bd" title="Editar" />
                  </Link>
                  <FaTrashAlt
                  style={{cursor: "pointer"}}
                    size={20}
                    color="#ab2929"
                    onClick={() => confirmDelete(_id)}
                    title="Deletar"
                  />
                </div>
              </div>
          );
        })
      )}
    </div>
  );
};

ShopCard.propTypes = {
  shop: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  isLoading: PropTypes.bool,
};

export default ShopCard;
