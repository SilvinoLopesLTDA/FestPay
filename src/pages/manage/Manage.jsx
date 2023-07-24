import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAdmins } from "../../redux/features/Admin/Actions/AdminSlice";
import ManageContainer from "../../components/manage/ManageContainer";

const Manage = () => {
  const dispatch = useDispatch();

  const adminState = useSelector((state) => state.admin);
  const { admin, isLoading, isError, message } = adminState || {};

  useEffect(() => {
    dispatch(getAdmins());

    if (isError) {
      console.log(message);
    }
  }, [dispatch, isError, message]);

  return (
    <div>
      <ManageContainer admin={admin} isLoading={isLoading} />
    </div>
  );
};

Manage.propTypes = {
  manage: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default Manage;
