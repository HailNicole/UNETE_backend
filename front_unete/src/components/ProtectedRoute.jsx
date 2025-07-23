import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
const isAuthenticated = () => {
    return localStorage.getItem("auth") === "true";
};
const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" />;
};
ProtectedRoute.propTypes = {
    element: PropTypes.node.isRequired,
};
export default ProtectedRoute;