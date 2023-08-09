import PropTypes from "prop-types";
import { SpinnerImg } from "../loader/Loader";
import {
  deleteAdmin,
  getAdmins,
  selectIsLoading,
} from "../../redux/features/Admin/Actions/AdminSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import styles from "../../pages/shop/shopDetails/ShopDetails.module.scss";

const ManageContainer = ({ admin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);

  const delAdmin = async (adminId) => {
    await dispatch(deleteAdmin(adminId));
    await dispatch(getAdmins());
  };

  const confirmDeleteAdmin = (adminId) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Deseja retirar permanentemente esse administrador?",
      icon: "warning",
      width: "50em",
      showCancelButton: true,
      confirmButtonColor: "#EF233C",
      cancelButtonColor: "#2B2D42",
      confirmButtonText: "Sim, Retirar",
      cancelButtonText: "Não, Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        delAdmin(adminId);
        navigate(`/manage`);
        Swal.fire({
          icon: "success",
          title: "Administrador Retirado",
          text: "Esse administrador foi retirado com sucesso!",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "info",
          title: "Ação Cancelada",
          text: "Não se preocupe, os administradores estão seguro :)",
        });
      }
    });
  };

  return (
    <div className={`${styles.items_list} flex justify-center items-center h-full flex-col`}>
      <div className="bg-slate-900 w-11/12 my-16 rounded-xl">
        <div className="flex justify-between items-center mx-10 my-7 sm:flex-col">
          <h3 className="text-2xl font-semibold">
            {" "}
            Painel de{" "}
            <span className="text-violet-700 font-bold">Controle</span>
          </h3>
          {isLoading && <SpinnerImg />}
          <Link to="/add-admin">
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-semibold sm:mt-5">
              Adicionar Administrador
            </button>
          </Link>
        </div>
        <div className=" my-5 py-6 border-t-2 border-indigo-500/50">
          <h3 className="text-xl font-semibold text-center">
            Administradores
            <span className="text-violet-700 font-bold"> FestPay</span>
          </h3>
          <div className={`${styles.table} m-5`}>
            {!isLoading && admin?.length === 0 ? (
              <p className="p-4 text-center">
                Nenhum administrador cadastrado. Por favor, adicione um
                administrador!
              </p>
            ) : (
              <table className="bg-slate-950/75 w-full">
                <thead>
                  <tr className="border-y border-indigo-500">
                    <th className="py-2"> s/n </th>
                    <th> Nome </th>
                    <th> Email </th>
                    <th> Ações </th>
                  </tr>
                </thead>
                <tbody>
                  {admin?.map((admin, index) => {
                    const { _id, name, email } = admin;
                    return (
                      <tr
                        key={_id}
                        className="text-center hover:bg-slate-800 odd:bg-slate-900/80 even:bg-slate-900/20 "
                      >
                        <td className="py-2">{index + 1}</td>
                        <td>{name}</td>
                        <td>{email}</td>
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
                              onClick={() => confirmDeleteAdmin(_id)}
                              title="Deletar"
                            />
                            <Link to={`/edit-admin/${_id}`}>
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

ManageContainer.propTypes = {
  admin: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};

export default ManageContainer;
