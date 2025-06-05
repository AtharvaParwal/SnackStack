import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import logout from "../common/Logout";
import { useState, useEffect } from "react";
import axios from "axios";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const Navbar = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (localStorage.getItem("status") == "loggedIn" && localStorage.getItem("userType") == "Buyer") {
      //remove quotes from email
      const email = localStorage.getItem("user").replace(/"/g, "");

      const walletInfo = {
        email: email
      };
      axios
        .post("api/wallet/getbalance", walletInfo)
        .then((response) => {
          setBalance(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  }, []);


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            SnackStack Portal
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {localStorage.getItem("status") === "loggedIn" && localStorage.getItem("userType") === "Buyer" ? <Button color="inherit" onClick={() => navigate("/buyerfood")}>Food</Button> : ""}
          {localStorage.getItem("status") === "loggedIn" && localStorage.getItem("userType") === "Vendor" ? <Button color="inherit" onClick={() => navigate("/vendorfood")}>Food</Button> : ""}
          {localStorage.getItem("status") === "loggedIn" ? < Button color="inherit" onClick={() => navigate("/orders")}>My Orders</Button> : ""}
          {localStorage.getItem("status") === "loggedIn" && localStorage.getItem("userType") === "Vendor" ? <Button color="inherit" onClick={() => navigate("/statistics")}>Statistics</Button> : ""}
          {localStorage.getItem("status") !== "loggedIn" ? <Button color="inherit" onClick={() => navigate("/register")}>Register</Button> : ""}
          {localStorage.getItem("status") !== "loggedIn" ? <Button color="inherit" onClick={() => navigate("/login")}>Login</Button> : ""}
          {localStorage.getItem("status") === "loggedIn" ? <Button color="inherit" onClick={() => navigate("/profile")} > My Profile </Button> : ""}
          {localStorage.getItem("status") === "loggedIn" ? <Button color="inherit" onClick={() => logout()}>Logout</Button> : ""}
          {localStorage.getItem("status") === "loggedIn" && localStorage.getItem("userType") === "Buyer" ? <Button color="inherit" onClick={() => navigate("/wallet")} ><CurrencyRupeeIcon /> < div id="BalNav"> {balance}</div>  <AccountBalanceWalletIcon fontSize="large" /></Button> : ""}

        </Toolbar>
      </AppBar>
    </Box >
  );
};

export default Navbar;
