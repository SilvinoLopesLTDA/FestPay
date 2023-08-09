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
import PassStyle from "../../../components/forms/shop/FormShop.module.scss"

const ShopEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shopEdit = useSelector(selectShop);
  const [shop, setShop] = useState(shopEdit);
  const [visible, setVisible] = useState(true);

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
      text: "Deseja excluir permanentemente esse Ponto de Venda?",
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
          title: "Ponto de Venda Excluido",
          text: "Ponto de Venda excluido com sucesso!",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "info",
          title: "Ação Cancelada",
          text: "Não se preocupe, seu Ponto de Venda está securo :)",
        });
      }
    });
  };

  return (
    <div className="flex justify-center itemss-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between mb-3">
          <h2 className="text-2xl font-semibold">
            Editar o Ponto de{" "}
            <span className="text-violet-700 font-bold">Venda</span>
          </h2>
          <Link to={`/details-shop/${id}`}>
            <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium">
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
          <label htmlFor="name">
            Nome
          </label>
          <input
            type="text"
            placeholder="Bebidas..."
            name="name"
            id="name"
            value={shop?.name}
            onChange={handleInputChange}
            className={
              isSubmitted && shop?.name === "" ? `${styles.highlight}` : ""
            }
          />
          <label htmlFor="password" className="text-slate-500/75">
          {" "}
          Senha{" "}
        </label>
        <div className="flex">
          <input
            type={visible ? "text" : "password"}
            placeholder={visible ? "1234" : "****"}
            required
            className="w-full"
            id="password"
            name="password"
            value={shop?.password}
            onChange={handlePwdChange}
          />
          <div
            className={PassStyle.toggleVisible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? (
              <AiOutlineEye color="#0f172a" />
            ) : (
              <AiOutlineEyeInvisible color="#0f172a" />
            )}
          </div>
        </div>
        </form>
          <div className="flex justify-between">
            <button
              onClick={() => confirmDelete(id)}
              className="px-5 py-2  bg-slate-800 border-2 border-red-600 text-red-500 rounded-sm text-lg font-medium mt-10"
            >
              Deletar
            </button>
            <button
              className="px-5 py bg-violet-800 rounded-sm text-lg font-semibold mt-10"
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
