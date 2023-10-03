import { Link, useParams } from "react-router-dom";
import styles from "../../client/Client.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../../../components/loader/Loader";
import {
  deleteShop,
  getShops,
  selectIsLoading,
  selectShop,
  updateShop,
} from "../../../redux/features/shop/shopSlice";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ShopEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shopEdit = useSelector(selectShop);
  const [shop, setShop] = useState(shopEdit);
  const [visible, setVisible] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const isLoading = useSelector(selectIsLoading);

  const { id } = useParams();
  const { name, password, profit, cost } = shop;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShop({ ...shop, [name]: value });
  };

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value.replace(/\D/g, "");
    filteredValue = filteredValue.substring(0, 4);
    handleInputChange({ target: { name, value: filteredValue } });
  };

  const saveEditShop = async () => {
    const formData = {
      name: name,
      password: password,
      profit: profit,
      cost: cost,
    };
    const updateData = {
      id: id,
      formData: formData,
    };
    await dispatch(updateShop(updateData));
    navigate(`/details-shop/${id}`);
  };

  const saveEditData = () => {
    const EditData = saveEditShop();
    return EditData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (shop.name && shop.password && shop.profit && shop.cost) {
      saveEditShop(shop);
      navigate(`/edit-shop/${id}`);
    } else {
      navigate(`/edit-shop/${id}`);
    }
  };

  const delShop = async (id) => {
    await dispatch(deleteShop(id));
    await dispatch(getShops());
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Deseja excluir permanentemente este ponto de venda?",
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
          title: "Ponto de venda Excluído",
          text: "Ponto de venda excluído com sucesso!",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "info",
          title: "Ação Cancelada!",
          text: "Não se preocupe, seu ponto de venda está seguro.",
        });
      }
    });
  };

  return (
    <div className="flex justify-center itemss-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold">
            Editar o Ponto de{" "}
            <span className="text-violet-600 font-bold">Venda</span>
          </h2>
          <Link to={`/details-shop/${id}`}>
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300">
              Voltar
            </button>
          </Link>
        </div>
        <p className="mb-3 text-lg">
          {" "}
          - Insira os dados do Ponto de Venda abaixo{" "}
        </p>
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
            saveEditShop(e);
          }}
        >
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            placeholder="Digite o novo nome da barraca..."
            name="name"
            id="name"
            value={shop?.name}
            onChange={handleInputChange}
            className={
              isSubmitted && shop?.name === "" ? `${styles.highlight}` : ""
            }
          />
          <label htmlFor="password" className="text-slate-500/75">
            Senha
          </label>
          <div className="flex">
            <input
              type={visible ? "text" : "password"}
              placeholder="Digite a nova senha da barraca..."
              required
              className={`w-full border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 ${
                isSubmitted && !shop?.password ? `${styles.highlight}` : ""
              }`}
              id="password"
              name="password"
              value={shop?.password}
              onChange={handlePwdChange}
            />
            <div
              className="cursor-pointer ml-2 flex items-center"
              onClick={() => setVisible(!visible)}
            >
              {visible ? (
                <AiOutlineEye color="#fff" size={25} />
              ) : (
                <AiOutlineEyeInvisible color="#fff" size={25} />
              )}
            </div>
          </div>
        </form>
        <div className="flex justify-between">
          <button
            onClick={() => confirmDelete(id)}
            className="px-5 py-2 bg-slate-800 border-2 border-red-600 text-red-500 rounded-sm text-lg font-medium mt-10 hover:bg-slate-800/60 transition-colors duration-300"
          >
            Deletar
          </button>
          <button
            className="px-5 py bg-violet-800 rounded-sm text-lg font-semibold mt-10 hover:bg-violet-700 transition-colors duration-300"
            type="submit"
            onClick={saveEditData}
          >
            {" "}
            Editar Barraca
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopEdit;
