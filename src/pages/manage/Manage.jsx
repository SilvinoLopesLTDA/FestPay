import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ManageContainer from "../../components/manage/ManageContainer";
import {
  getSubaccounts,
  selectIsLoading,
  selectSubaccount,
} from "../../redux/features/auth/authSlice";

const Manage = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsLoading);
  const subaccounts = useSelector(selectSubaccount);
  const { isError, message } = subaccounts || {};

  useEffect(() => {
    dispatch(getSubaccounts());

    if (isError) {
      console.log(message);
    }
  }, [dispatch, isError, message]);

  return (
    <div>
      <ManageContainer subaccount={subaccounts} isLoading={isLoading} />
    </div>
  );
};

export default Manage;
