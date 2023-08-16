import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/loader/Loader";
import {
  getAdmins,
  registerAdmin,
  selectIsLoading,
} from "../../../redux/features/Admin/Actions/AdminSlice";
import FormAdmin from "../../../components/manage/form/FormAdmin";
import * as Components from "./Components";
import FormWorker from "../../../components/manage/form/FormWorker";
import {
  getWorkers,
  registerWorker,
  selectIsLoadingWorker,
} from "../../../redux/features/Worker/Actions/workerSlice";

const initialState = {
  name: "",
  email: "",
  password: "",
};

const workerInitialState = {
  name: "",
  email: "",
  password: "",
  func: "",
};

const AddAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(initialState);
  const [worker, setWorker] = useState(workerInitialState);
  const [submittedAdmins, setSubmittedAdmins] = useState([]);
  const [submittedWorkers, setSubmittedWorkers] = useState([]);
  const [signIn, toggle] = useState(true);

  const isLoading = useSelector(selectIsLoading);
  const isLoadingWorker = useSelector(selectIsLoadingWorker);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleInputWorkerChange = (e) => {
    const { name, value } = e.target;
    setWorker({ ...worker, [name]: value });
  };

  const saveAdmin = async () => {
    event.preventDefault();
    const { name, email, password } = admin;
    const formData = {
      name: name,
      email: email,
      password: password,
    };
    console.log(formData);
    await dispatch(registerAdmin(formData));

    if (admin.name && admin.email && admin.password) {
      const newAdmin = { ...admin };
      setSubmittedAdmins([...submittedAdmins, newAdmin]);
      setAdmin(initialState);
      dispatch(getAdmins());
      navigate("/manage");
    }
  };

  const saveWorker = async () => {
    event.preventDefault();
    const { name, email, password, func } = worker;
    const formData = {
      name: name,
      email: email,
      password: password,
      func: func,
    };
    console.log(formData);
    await dispatch(registerWorker(formData));

    if (worker.name && worker.email && worker.password && worker.func) {
      const newWorker = { ...worker };
      setSubmittedWorkers([...submittedWorkers, newWorker]);
      setWorker(initialState);
      dispatch(getWorkers());
      navigate("/manage");
    }
  };

  return (
    <Components.Container>
      {isLoading && <Loader />}
      {isLoadingWorker && <Loader />}
      <Components.WorkersContainer signinIn={signIn}>
        <Components.Form>
          <Components.Title> Registre um Operário </Components.Title>
          <FormWorker
            worker={worker}
            saveWorker={saveWorker}
            handleInputWorkerChange={handleInputWorkerChange}
            required={" *"}
          />
        </Components.Form>
      </Components.WorkersContainer>

      <Components.AdminContainer signinIn={signIn}>
        <Components.Form>
          <Components.Title>Registre um Administrador</Components.Title>
          <FormAdmin
            admin={admin}
            saveAdmin={saveAdmin}
            handleInputChange={handleInputChange}
            required={" *"}
          />
        </Components.Form>
      </Components.AdminContainer>

      <Components.OverlayContainer signinIn={signIn}>
        <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
            <Components.Title>
              {" "}
              Deseja Adcionar um Administrador?{" "}
            </Components.Title>
            <Components.Paragraph>
              Precisando de Ajuda? Administradores em conjunto com você podem
              organizar um evento, mas pense bem em quem escolher para essa
              função
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>
              Por aqui
            </Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signinIn={signIn}>
            <Components.Title> Deseja Adcionar um Operário?</Components.Title>
            <Components.Paragraph>
              Operários são tipos de usuarios perfeitos para serviços variados,
              desde caixa ao almoxarifado
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(false)}>
              Por aqui
            </Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
};

AddAdmin.propTypes = {
  admin: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleInputChange: PropTypes.func,
  saveAdmin: PropTypes.func,
};

export default AddAdmin;
