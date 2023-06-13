import { Link, useParams } from "react-router-dom";
import styles from "../../client/Client.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../../../components/loader/Loader";
import { selectIsLoading, selectShop, updateShop } from "../../../redux/features/shop/shopSlice";


const ShopEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shopEdit = useSelector(selectShop);
  const [shop, setShop] = useState(shopEdit);
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isLoading = useSelector(selectIsLoading);

  const { id } = useParams();
  const { name, password, profit, cost } = shop;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShop({ ...shop, [name]: value });
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
    const EditData = saveEditShop()
    return EditData
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
              Nome <span className="text-red-600">*</span>
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
            <label htmlFor="password">
              Senha <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              placeholder="4582"
              name="password"
              id="password"
              value={shop?.password}
              onChange={handleInputChange}
              className={
                isSubmitted && shop?.password === ""
                  ? `${styles.highlight}`
                  : ""
              }
            />
            <label htmlFor="cost">
              Custo <span className="text-red-600"> *</span>
            </label>
            <input
              type="text"
              placeholder="20"
              name="cost"
              id="cost"
              value={shop?.cost}
              onChange={handleInputChange}
              className={
                isSubmitted && shop?.cost === "" ? `${styles.highlight}` : ""
              }
            />
            <label htmlFor="profit">Lucro</label>
            <input
              type="text"
              placeholder="40"
              name="profit"
              id="profit"
              value={shop?.profit}
              onChange={handleInputChange}
              className={
                isSubmitted && shop?.profit === "" ? `${styles.highlight}` : ""
              }
            />
            <button
              className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium mt-10"
              type="submit"
              onClick={saveEditData}
            >
              {" "}
              Editar Barraca
            </button>
          </form>
        </div>
      </div>
  );
};

export default ShopEdit;
