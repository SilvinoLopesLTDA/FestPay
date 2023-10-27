import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER } from "../redux/features/auth/authSlice";

function ProtectedRoute({ children, allowedRoles, allowedWorkerFunction }) {
  const user = useSelector((state) => state.auth.user);
  const userRole = user ? user.role : null;
  const workerFuntion = userRole ? userRole === "worker" : null;
  const isAuthorized =
    userRole === "master" ||
    allowedRoles.includes(userRole) ||
    allowedWorkerFunction.includes(workerFuntion);

  const dispatch = useDispatch();

  if (!user && localStorage.getItem("user")) {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    dispatch(SET_USER(storedUser));
  }

  if (isAuthorized) {
    return children;
  } else {
    return <Navigate to="/access-denied" />;
  }
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  allowedWorkerFunction: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
