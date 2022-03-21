import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import Itempage from "./pages/Itempage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import DataContext from "./Store";
import Details from "./pages/Details";
import AdminLogin from "./components/common/admin/AdminLogin";
import Adminpanel from "./components/common/admin/Adminpanel";
import Search from "./pages/Search";
import Payment from "./pages/Payment";
import PaymentSuccess from "./components/common/payments/paymentSuccess";
import PaymentFailure from "./components/common/payments/paymentFailure";

const PrivateRoute = ({ children, isAuth }) => {
  const { isLoggedIn } = useContext(DataContext);
  return isLoggedIn ? children : <Navigate to="/" />;
};

export const AppRouting = () => {
  return (
    <>
      <BrowserRouter>
        <div>
          <Navbar />
        </div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/adminpanel" element={<Adminpanel />} />
          <Route path="/search/:search" element={<Search />} />
          <Route path="/payment/:info" element={<Payment />} />
          <Route path="/failure" element={<PaymentFailure />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route
            path="/items"
            element={
              <PrivateRoute>
                <Itempage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};
