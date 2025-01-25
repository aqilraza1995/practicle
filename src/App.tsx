import { lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

const Login = lazy(() => import("./pages/login"));
const Home = lazy(() => import("./pages/home"));
const AddEditUser = lazy(() => import("./pages/home/AddEditUser"));

const PrivateRoutes = () => {
  const auth =
    localStorage.getItem("authUser") !== null
      ? JSON.parse(localStorage.getItem("authUser") || "")
      : null;
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/add-user" element={<AddEditUser />} />
          <Route path="/edit-user/:id" element={<AddEditUser />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;