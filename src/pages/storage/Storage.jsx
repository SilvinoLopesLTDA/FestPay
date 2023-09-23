import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import StorageContainer from "../../components/storage/StorageContainer";
import { getItems } from "../../redux/features/items/itemsSlice";

const Storage = () => {
  const dispatch = useDispatch();

  const itemState = useSelector((state) => state.items);
  const { item, isLoading, isError, message } = itemState || {};

  useEffect(() => {
    dispatch(getItems());

    if (isError) {
      console.log(message);
    }
  }, [dispatch, isError, message]);

  return (
    <div>
      <StorageContainer item={item} isLoading={isLoading} />
    </div>
  );
};

export default Storage;
