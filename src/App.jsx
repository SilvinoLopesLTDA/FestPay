import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import appRoutes from "./AppRoutes.jsx";
import { useEffect } from "react";
import { getLoginStatus, getUser } from "./redux/features/auth/authService.js";
import { SET_LOGIN, SET_USER } from "./redux/features/auth/authSlice.js";

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const status = await getLoginStatus();
        if (status) {
          const userData = await getUser();
          dispatch(SET_LOGIN(status));
          dispatch(SET_USER(userData));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <Router>
      <ToastContainer theme="dark" />
      <Routes>
        {appRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
