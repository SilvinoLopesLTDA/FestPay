import { Link, useLocation, useParams } from "react-router-dom";
import styles from "../../client/Client.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../../components/loader/Loader";
import {
  getItem,
  selectIsLoading,
  selectItem,
  updateItem,
} from "../../../redux/features/shop/itemSlice";

const EditItem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shop = useSelector(selectItem); // Renomear para 'shop' para refletir a estrutura de dados

  const [isSubmitted, setIsSubmitted] = useState(false);

  let { state } = useLocation();
  const shopId = state.id;
  const isLoading = useSelector(selectIsLoading);

  const { id } = useParams();

  const [item, setItem] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    dispatch(getItem(shopId));
  }, [dispatch, shopId]);

  useEffect(() => {
    // Atualizar o estado 'item' com os valores corretos ao carregar o 'shop' retornado pela API
    if (shop && shop.items) {
      const selectedItem = shop.items.find((itemData) => itemData._id === id);
      if (selectedItem) {
        setItem(selectedItem);
      }
    }
  }, [shop, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/[^0-9.,]/g, "");
    const dotFilter = filteredValue.replace(",", ".");
    const decimalCount = dotFilter.split(".").length - 1;
    let cleanedValue = dotFilter;
    if (decimalCount > 1) {
      const lastIndex = dotFilter.lastIndexOf(".");
      cleanedValue =
        dotFilter.substring(0, lastIndex) + dotFilter.substring(lastIndex + 1);
    }
    handleInputChange({ target: { name, value: cleanedValue } });
  };

  const saveItemData = () => {
    const formData = {
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    };

    dispatch(updateItem({ shopId: shopId, itemId: id, formData })).then(() => {
      navigate(`/details-shop/${shopId}`);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (item.name && item.price && item.quantity) {
      saveItemData();
    } else {
      navigate(`/add-item/${id}`);
    }
  };

  return (
    <>
      <div className="flex justify-center itemss-center">
        {isLoading && <Loader />}
        <div className={styles.content}>
          <div className="flex justify-between mb-3">
            <h2 className="text-2xl font-semibold">
              Edite um{" "}
              <span className="text-violet-700 font-bold">Item</span>
            </h2>
            <Link to={`/details-shop/${shopId}`}>
              <button className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium">
                Voltar
              </button>
            </Link>
          </div>
          <p className="mb-3 text-lg"> - Insira os dados do Item abaixo </p>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <label htmlFor="name">
              {" "}
              Nome
            </label>
            <input
              type="text"
              placeholder="Bebidas..."
              name="name"
              id="name"
              value={item?.name}
              onChange={handleInputChange}
              className={
                isSubmitted && item?.name === "" ? `${styles.highlight}` : ""
              }
            />

            <label htmlFor="price">
              {" "}
              Preço
            </label>
            <input
              type="text"
              placeholder="10"
              name="price"
              id="price"
              value={item?.price}
              onChange={handlePriceChange}
              className={
                isSubmitted && item?.price === "" ? `${styles.highlight}` : ""
              }
            />

            <label htmlFor="quantity">
              {" "}
              Quantidade
            </label>
            <input
              type="text"
              placeholder="10"
              name="quantity"
              id="quantity"
              value={item?.quantity}
              onChange={handlePriceChange}
              className={
                isSubmitted && item?.quantity === ""
                  ? `${styles.highlight}`
                  : ""
              }
            />

            <button
              className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium mt-10"
              type="submit"
              onClick={saveItemData}
            >
              {" "}
              Editar Item
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditItem;
