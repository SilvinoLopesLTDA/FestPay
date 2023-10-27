import {
  Welcome,
  Login,
  Register,
  Forgot,
  Reset,
  Sidebar,
  Layout,
  Home,
  Dashboard,
  Manage,
  AddSubaccount,
  EditAdmin,
  EditWorker,
  Shop,
  AddShop,
  ShopDetails,
  ShopEdit,
  AddItem,
  BuyItem,
  TicketWindow,
  Storage,
  AddBalance,
  ClientInfo,
  Terms,
  Privacy,
  Faq,
  AccessDenied,
  EditItem,
  AddItems,
  EditItems,
  ProtectedRoute,
  Profile,
  EditProfile,
  Clients,
  EditClient,
  AddWorker,
  EmailConfirmation,
  WorkersShop,
} from "./AppPages";

const appRoutes = [
  { path: "/", element: <Welcome /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot", element: <Forgot /> },
  { path: "/reset-password/:resetToken", element: <Reset /> },
  { path: "/confirm-email/:confirmationToken", element: <EmailConfirmation /> },
  {
    path: "/home",
    element: (
      <Sidebar>
        <Layout>
          <Home />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["master"]}>
        <Sidebar>
          <Layout>
            <Dashboard />
          </Layout>
        </Sidebar>
      </ProtectedRoute>
    ),
  },
  {
    path: "/manage",
    element: (
      <ProtectedRoute allowedRoles={["master"]}>
        <Sidebar>
          <Layout>
            <Manage />
          </Layout>
        </Sidebar>
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-subaccount",
    element: (
      <ProtectedRoute allowedRoles={["master"]}>
        <Sidebar>
          <Layout>
            <AddSubaccount />
          </Layout>
        </Sidebar>
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit-admin/:id",
    element: (
      <ProtectedRoute allowedRoles={["master"]}>
        <Sidebar>
          <Layout>
            <EditAdmin />
          </Layout>
        </Sidebar>
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit-worker/:id",
    element: (
      <ProtectedRoute allowedRoles={["master"]}>
        <Sidebar>
          <Layout>
            <EditWorker />
          </Layout>
        </Sidebar>
      </ProtectedRoute>
    ),
  },
  {
    path: "/clients",
    element: (
      <ProtectedRoute allowedRoles={["master"]}>
        <Sidebar>
          <Layout>
            <Clients />
          </Layout>
        </Sidebar>
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit-client/:id",
    element: (
      <ProtectedRoute allowedRoles={["master"]}>
        <Sidebar>
          <Layout>
            <EditClient />
          </Layout>
        </Sidebar>
      </ProtectedRoute>
    ),
  },
  {
    path: "/shops",
    element: (
      <ProtectedRoute
        allowedRoles={["master", "admin", "worker"]}
        allowedWorkerFunction={["Barraca"]}
      >
        <Sidebar>
          <Layout>
            <Shop />
          </Layout>
        </Sidebar>
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-shop",
    element: (
      <Sidebar>
        <Layout>
          <AddShop />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/add-worker/:id",
    element: (
      <Sidebar>
        <Layout>
          <AddWorker />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/workers-shop/:id",
    element: (
      <Sidebar>
        <Layout>
          <WorkersShop />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/details-shop/:id",
    element: (
      <Sidebar>
        <Layout>
          <ShopDetails />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/edit-shop/:id",
    element: (
      <Sidebar>
        <Layout>
          <ShopEdit />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/add-item/:id",
    element: (
      <Sidebar>
        <Layout>
          <AddItem />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/edit-item/:id",
    element: (
      <Sidebar>
        <Layout>
          <EditItem />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/buy-item",
    element: (
      <Sidebar>
        <Layout>
          <BuyItem />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/ticket-window",
    element: (
      <Sidebar>
        <Layout>
          <TicketWindow />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/storage",
    element: (
      <Sidebar>
        <Layout>
          <Storage />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/add-item",
    element: (
      <Sidebar>
        <Layout>
          <AddItems />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/edit-items/:id",
    element: (
      <Sidebar>
        <Layout>
          <EditItems />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/add-balance",
    element: (
      <Sidebar>
        <Layout>
          <AddBalance />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/profile",
    element: (
      <Sidebar>
        <Layout>
          <Profile />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/edit-profile",
    element: (
      <Sidebar>
        <Layout>
          <EditProfile />
        </Layout>
      </Sidebar>
    ),
  },
  { path: "/client-info/:id", element: <ClientInfo /> },
  {
    path: "/terms",
    element: (
      <Sidebar>
        <Layout>
          <Terms />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/privacy",
    element: (
      <Sidebar>
        <Layout>
          <Privacy />
        </Layout>
      </Sidebar>
    ),
  },
  {
    path: "/faq",
    element: (
      <Sidebar>
        <Layout>
          <Faq />
        </Layout>
      </Sidebar>
    ),
  },
  { path: "/access-denied", element: <AccessDenied /> },
];

export default appRoutes;
