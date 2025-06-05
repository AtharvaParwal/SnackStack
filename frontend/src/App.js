import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import BuyerFood from "./components/users/BuyerFood";
import Home from "./components/common/Home";
import Register from "./components/common/Register";
import Navbar from "./components/templates/Navbar";
import Profile from "./components/users/Profile";
import Login from "./components/common/Login";
import Wallet from "./components/common/Wallet";
import VendorFood from "./components/users/VendorFood";
import Orders from "./components/common/Orders";
import Statistics from "./components/users/Statistics";

import { useState, useEffect } from "react";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  const [userMail, setUserMail] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="buyerfood" element={<BuyerFood />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="vendorfood" element={<VendorFood />} />
          <Route path="orders" element={<Orders />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
