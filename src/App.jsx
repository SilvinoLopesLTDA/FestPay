import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AddBalance from "./pages/addBalance/AddBalance";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <Sidebar>
              <Layout>
                <Dashboard />
              </Layout>
            </Sidebar>
          }
        />
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
