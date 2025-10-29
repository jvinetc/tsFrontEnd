import { Routes, Route, HashRouter } from "react-router-dom";
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
import { useUser } from "./context/UserContext";
import Payments from "./Pages/Payments";
import StopForm from "./components/StopForm";
import SellForm from "./components/SellForm";
import PickUp from "./Pages/PickUp";
import HomeCircuit from "./apiCircuit/pages/HomeCircuit";
import Plans from "./apiCircuit/pages/Plans";
import StopsCircuit from "./apiCircuit/pages/StopsCircuit";
/* import SetupAdmin from "./Pages/SetupAdmin"; */

function AppRouter() {
  const { token } = useUser();
  /* const setupCompleted = localStorage.getItem('setupCompleted') === 'true'; */
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={/* !setupCompleted? 
            <SetupAdmin onComplete={() => window.location.reload()} />: */!token ? <Login /> : <Home />} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="configuration" element={<ProtectedRoute><Configuration /></ProtectedRoute>} />
          <Route path="logout" element={<Logout />} />
          <Route path="drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
          <Route path="drivers/create" element={<ProtectedRoute><DriverForm /></ProtectedRoute>} />
          <Route path="drivers/edit/:id" element={<ProtectedRoute><DriverForm /></ProtectedRoute>} />
          <Route path="sells" element={<ProtectedRoute><Sells /></ProtectedRoute>} />
          <Route path="sells/edit/:id" element={<ProtectedRoute><SellForm /></ProtectedRoute>} />
          <Route path="sells/create" element={<ProtectedRoute><SellForm /></ProtectedRoute>} />
          <Route path="stops" element={<ProtectedRoute><Stops /></ProtectedRoute>} />
          <Route path="stops/create/:sellId" element={<ProtectedRoute><StopForm /></ProtectedRoute>} />
          <Route path="stops/edit/:id" element={<ProtectedRoute><StopForm /></ProtectedRoute>} />
          <Route path="prices" element={<ProtectedRoute><Prices /></ProtectedRoute>} />
          <Route path="pickups" element={<ProtectedRoute><PickUp /></ProtectedRoute>} />
          <Route path="payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="prices/create" element={<ProtectedRoute><RateForm /></ProtectedRoute>} />
          <Route path="circuit/home" element={<ProtectedRoute><HomeCircuit /></ProtectedRoute>} />
          <Route path="circuit/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
          <Route path="circuit/stops" element={<ProtectedRoute><StopsCircuit /></ProtectedRoute>} />
          <Route path="prices/edit/:id" element={<ProtectedRoute><RateForm /></ProtectedRoute>} />
          <Route path="valida_pago" element={<PaymentValidate />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default AppRouter;
