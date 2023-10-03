import { useParams } from "react-router-dom";
import styles from "../../client/Client.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../../../components/loader/Loader";
import {
  selectIsLoading,
  updateItem,
  getItem,
  getItems,
  selectItems,
} from "../../../redux/features/items/itemsSlice";
import { useEffect } from "react";

const EditItems = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const editItem = useSelector(selectItems);
  const [items, setItems] = useState({});

  useEffect(() => {
    dispatch(getItem(id));
  }, [dispatch, id]);

  useEffect(() => {
    setItems(editItem);
  }, [editItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItems({ ...items, [name]: value });
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

  const saveEditItem = async () => {
    const formData = {
      name: items.name,
      price: items.price,
      quantity: items.quantity,
    };
    const updateData = {
      id: id,
      formData: formData,
    };
    await dispatch(updateItem(updateData));
    await dispatch(getItems());
    navigate("/storage");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    saveEditItem(items);
  };

  const handleReturn = async () => {
    await dispatch(getItems());
    navigate("/storage");
  };

  return (
    <div className="flex justify-center items-center">
      {isLoading && <Loader />}
      <div className={styles.content}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold">
            Editar
            <span className="text-violet-600 font-bold"> Item</span>
          </h2>
          <button
            className="px-3 py-2 bg-violet-800 rounded-sm text-lg font-medium hover:bg-violet-700 transition-colors duration-300"
            onClick={handleReturn}
          >
            Voltar
          </button>
        </div>
        <p className="mb-3 text-lg">- Edite os dados do item abaixo</p>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            placeholder="Digite o novo nome do item..."
            name="name"
            id="name"
            value={items?.name}
            onChange={handleInputChange}
            className={
              isSubmitted && items?.name === "" ? `${styles.highlight}` : ""
            }
          />
          <label htmlFor="price">Preço</label>
          <input
            type="text"
            placeholder="Digite o novo preço do item..."
            name="price"
            id="price"
            value={items?.price}
            onChange={handlePriceChange}
            className={
              isSubmitted && items?.price === "" ? `${styles.highlight}` : ""
            }
          />
          <label htmlFor="quantity">Quantidade</label>
          <input
            type="text"
            placeholder="Digite a nova quantidade do item..."
            name="quantity"
            id="quantity"
            value={items?.quantity}
            onChange={handleInputChange}
            className={
              isSubmitted && items?.quantity === "" ? `${styles.highlight}` : ""
            }
          />
          <div className="flex">
            <button
              className="w-full py-2 bg-violet-800 rounded-sm text-lg font-semibold hover:bg-violet-700 transition-colors duration-300 mt-10"
              type="submit"
            >
              Editar Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItems;
