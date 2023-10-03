import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, allowedRoles }) {
  const user = useSelector((state) => state.auth.user);
  console.log(user)
  const userRole = user ? user.role : null;
  const isAuthorized = userRole === "master" || allowedRoles.includes(userRole);

  if (isAuthorized) {
    return children;
  } else {
    return <Navigate to="/access-denied" />;
  }
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
