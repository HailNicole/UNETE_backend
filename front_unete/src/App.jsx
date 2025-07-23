import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Admin from "./pages/Admin";
import AdminReport from "./pages/AdminReport";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Orders from "./pages/Orders.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/admin"
            element={<ProtectedRoute element={<Admin />} />}
          />
          <Route
            path="/admin-report"
            element={<ProtectedRoute element={<AdminReport />} />}
          />
          <Route
            path="/order"
            element={<ProtectedRoute element={<Orders />} />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<Navigate to="/products" />} />
        </Routes>
        <Footer />
      </Router>
      <ToastContainer />
    </>
  );
}
export default App;
