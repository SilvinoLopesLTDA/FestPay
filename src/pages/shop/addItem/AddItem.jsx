import { Link, useParams } from "react-router-dom";
import styles from "../../client/Client.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../../../components/loader/Loader";
import {
  createItem,
  selectIsLoading,
} from "../../../redux/features/shop/itemSlice";

const initialState = {
  name: "",
  price: "",
  quantity: "",
};

const AddItem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [item, setItem] = useState(initialState);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isLoading = useSelector(selectIsLoading);

  const { id } = useParams();
  const { name, price, quantity } = item;

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

  const saveItems = async () => {
    event.preventDefault();
    const formData = {
      id: id,
      name: name,
      price: price,
      quantity: quantity,
    };

    await dispatch(createItem(formData));

    if (name && price && name.trim() !== "" && price.trim() !== "") {
      navigate(`/details-shop/${id}`);
    }
  };

  const saveItemData = () => {
    const itemData = {
      ...item,
    };

    saveItems(JSON.stringify(itemData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (item.name && item.price) {
      saveItems(item);
      navigate(`/add-item/${id}`);
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
              Adicione um{" "}
              <span className="text-violet-700 font-bold">Item</span>
            </h2>
            <Link to={`/details-shop/${id}`}>
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
              saveItems(e);
            }}
          >
            <label htmlFor="name">
              {" "}
              Nome<span className="text-red-600"> *</span>
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
              Preço <span className="text-red-600">*</span>
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
              Quantidade <span className="text-red-600">*</span>
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
              Criar Item
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddItem;
