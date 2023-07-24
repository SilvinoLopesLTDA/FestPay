import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { getLoginStatus } from "./services/authService";
import { SET_LOGIN } from "./redux/features/auth/authSlice";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Forgot from "./pages/auth/Forgot";
import Reset from "./pages/auth/Reset";
import Sidebar from "./components/sidebar/Sidebar";
import Layout from "./components/layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Shop from "./pages/shop/Shop";
import Client from "./pages/client/Client";
import Terms from "./pages/info/Terms";
import Privacy from "./pages/info/Privacy";
import Faq from "./pages/info/FAQ";
import AddBalance from "./pages/client/addBalance/AddBalance";
import AddShop from "./pages/shop/addShop/AddShop";
import ShopDetails from "./pages/shop/shopDetails/ShopDetails";
import ShopEdit from "./pages/shop/shopEdit/ShopEdit";
import AddItem from "./pages/shop/addItem/AddItem";
import BuyItem from "./pages/shop/buyItem/BuyItem";
import Welcome from "./pages/welcome/Welcome";
import ClientInfo from "./pages/client/info/ClientInfo";
import EditItem from "./pages/shop/editItem/EditItem";
import Manage from "./pages/manage/Manage";
import AddAdmin from "./pages/manage/addAdmin/AddAdmin";
import CreateAdminPassword from "./pages/manage/addAdmin/CreateAdminPassword";

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loginStatus() {
      const status = await getLoginStatus();
      dispatch(SET_LOGIN(status));
    }
    loginStatus();
  }, [dispatch]);

  const [resetQuantity, setResetQuantity] = useState(null);

  return (
    <Router>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password/:resetToken" element={<Reset />} />
        <Route path="/" element={<Welcome />} />

        <Route path="/resetpassword/:resetToken" element={<Reset />} />
        <Route
          path="/dashboard"
          element={
            <Sidebar>
              <Layout>
                <Dashboard />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/manage"
          element={
            <Sidebar>
              <Layout>
                <Manage />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/add-admin"
          element={
            <Sidebar>
              <Layout>
                <AddAdmin />
              </Layout>
            </Sidebar>
          }
        />
        <Route path="/create-password/:id" element={<CreateAdminPassword />} />
        <Route
          path="/shops"
          element={
            <Sidebar>
              <Layout>
                <Shop />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/add-shop"
          element={
            <Sidebar>
              <Layout>
                <AddShop />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/details-shop/:id"
          element={
            <Sidebar>
              <Layout>
                <ShopDetails handleResetQuantityValues={setResetQuantity} />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/edit-shop/:id"
          element={
            <Sidebar>
              <Layout>
                <ShopEdit />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/add-item/:id"
          element={
            <Sidebar>
              <Layout>
                <AddItem />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/edit-item/:id"
          element={
            <Sidebar>
              <Layout>
                <EditItem />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/buy-item"
          element={
            <Sidebar>
              <Layout>
                <BuyItem resetQuantity={resetQuantity} />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/clients"
          element={
            <Sidebar>
              <Layout>
                <Client />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/add-balance"
          element={
            <Sidebar>
              <Layout>
                <AddBalance />
              </Layout>
            </Sidebar>
          }
        />
        <Route path="/client-info/:id" element={<ClientInfo />} />
        <Route
          path="/terms"
          element={
            <Sidebar>
              <Layout>
                <Terms />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/privacy"
          element={
            <Sidebar>
              <Layout>
                <Privacy />
              </Layout>
            </Sidebar>
          }
        />
        <Route
          path="/faq"
          element={
            <Sidebar>
              <Layout>
                <Faq />
              </Layout>
            </Sidebar>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
