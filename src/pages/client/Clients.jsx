import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClients } from "../../redux/features/client/clientSlice";
import ClientContainer from "../../components/client/ClientContainer";

const Clients = () => {
  const dispatch = useDispatch();

  const clientState = useSelector((state) => state.client);
  const { client, isLoading, isError, message } = clientState || {};

  useEffect(() => {
    dispatch(getClients());

    if (isError) {
      console.log(message);
    }
  }, [dispatch, isError, message]);

  return (
    <div>
      <ClientContainer clients={client} isLoading={isLoading} />
    </div>
  );
};

export default Clients;
