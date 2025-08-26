import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./components/Layout";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Register from "./Pages/Register";
import Configuration from "./Pages/Configuration";
import Logout from "./Pages/Logout";
import Drivers from "./Pages/Drivers";
import Sells from "./Pages/Sells";
import Stops from "./Pages/Stops";
import PaymentValidate from "./Pages/PaymentValidate";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import DriverForm from "./components/DriverForm";
import Prices from "./Pages/Prices";
import RateForm from "./components/RateForm";


function AppRouter() {
  //const token = localStorage.getItem('token');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="configuration" element={<ProtectedRoute><Configuration /></ProtectedRoute>} />
          <Route path="logout" element={<Logout />} />
          <Route path="drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
          <Route path="drivers/create" element={<ProtectedRoute><DriverForm /></ProtectedRoute>} />
          <Route path="drivers/edit/:id" element={<ProtectedRoute><DriverForm /></ProtectedRoute>} />
          <Route path="sells" element={<ProtectedRoute><Sells /></ProtectedRoute>} />
          <Route path="stops" element={<ProtectedRoute><Stops /></ProtectedRoute>} />
          <Route path="prices" element={<ProtectedRoute><Prices /></ProtectedRoute>} />
          <Route path="prices/create" element={<ProtectedRoute><RateForm /></ProtectedRoute>} />
          <Route path="prices/edit/:id" element={<ProtectedRoute><RateForm /></ProtectedRoute>} />
          <Route path="valida_pago" element={<PaymentValidate />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
