import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAdmins } from "../../redux/features/Admin/Actions/AdminSlice";
import ManageContainer from "../../components/manage/ManageContainer";
import { getWorkers } from "../../redux/features/Worker/Actions/workerSlice";

const Manage = () => {
  const dispatch = useDispatch();

  const adminState = useSelector((state) => state.admin);
  const { admin, isLoading, isError, message } = adminState || {};

  const workerState = useSelector((state) => state.worker);
  const { worker, isLoadingWorker, isErrorWorker, messageWorker } = workerState || {};

  useEffect(() => {
    dispatch(getAdmins());

    if (isError) {
      console.log(message);
    }
  }, [dispatch, isError, message]);

  useEffect(() => {
    dispatch(getWorkers());

    if (isErrorWorker) {
      console.log(messageWorker);
    }
  }, [dispatch, isErrorWorker, messageWorker]);

  return (
    <div>
      <ManageContainer admin={admin} worker={worker} isLoading={isLoading} isLoadingWorker={isLoadingWorker} />
    </div>
  );
};

export default Manage;
