import { useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { logout, isAuthenticated } from "../../utils/auth";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [balance, setBalance] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  
  const isLoggedIn = isAuthenticated();
  const userType = localStorage.getItem("userType");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (isLoggedIn && userType === "Buyer") {
      fetchWalletBalance();
    }
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn, userType]);

  // Refresh balance when user navigates or when window gets focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isLoggedIn && userType === "Buyer") {
        fetchWalletBalance();
      }
    };

    const handleFocus = () => {
      if (isLoggedIn && userType === "Buyer") {
        fetchWalletBalance();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isLoggedIn, userType]);

  // Listen for balance updates from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'balanceUpdated' && isLoggedIn && userType === "Buyer") {
        fetchWalletBalance();
        // Remove the trigger
        localStorage.removeItem('balanceUpdated');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events in the same window
    const handleCustomBalanceUpdate = () => {
      if (isLoggedIn && userType === "Buyer") {
        fetchWalletBalance();
      }
    };

    window.addEventListener('balanceUpdated', handleCustomBalanceUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('balanceUpdated', handleCustomBalanceUpdate);
    };
  }, [isLoggedIn, userType]);

  const fetchWalletBalance = async () => {
    if (balanceLoading) return; // Prevent multiple simultaneous requests
    
    try {
      setBalanceLoading(true);
      
      // Ensure we have a valid token
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log("No auth token found");
        setBalance(0);
        return;
      }

      console.log("Fetching wallet balance...");
      
      // Use the protected endpoint with explicit headers
      const response = await axios.get(API_ENDPOINTS.GET_BALANCE, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Wallet balance response:", response.data);
      const newBalance = response.data.balance || 0;
      setBalance(newBalance);
      console.log("Balance updated to:", newBalance);
    } catch (error) {
      console.log("Error fetching wallet balance:", error);
      console.log("Error response:", error.response?.data);
      
      // If it's a 401 error, the token might be invalid
      if (error.response?.status === 401) {
        console.log("Authentication failed - token might be invalid");
        // Don't logout automatically from navbar, just set balance to 0
        setBalance(0);
      } else {
        setBalance(0);
      }
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      if (userType === "Buyer") {
        // Fetch pending orders using protected endpoint
        const response = await axios.get(API_ENDPOINTS.MY_ORDERS);
        const pendingOrders = response.data.filter(order => 
          ["ACCEPTED", "COOKING", "READY FOR PICKUP"].includes(order.status)
        );
        setNotifications(pendingOrders.length);
      } else if (userType === "Vendor") {
        // Fetch new orders for vendor using protected endpoint
        const response = await axios.get(API_ENDPOINTS.VENDOR_ORDERS);
        const newOrders = response.data.filter(order => order.status === "PLACED");
        setNotifications(newOrders.length);
      }
    } catch (error) {
      console.log("Error fetching notifications:", error);
      setNotifications(0);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const renderDesktopMenu = () => (
    <>
      {isLoggedIn && userType === "Buyer" && (
        <Button 
          color="inherit" 
          onClick={() => navigate("/buyerfood")}
          variant={isActivePage("/buyerfood") ? "outlined" : "text"}
        >
          Browse Food
        </Button>
      )}
      {isLoggedIn && userType === "Vendor" && (
        <Button 
          color="inherit" 
          onClick={() => navigate("/vendorfood")}
          variant={isActivePage("/vendorfood") ? "outlined" : "text"}
        >
          Manage Food
        </Button>
      )}
      {isLoggedIn && (
        <Button 
          color="inherit" 
          onClick={() => navigate("/orders")}
          variant={isActivePage("/orders") ? "outlined" : "text"}
        >
          Orders
        </Button>
      )}
      {isLoggedIn && userType === "Vendor" && (
        <Button 
          color="inherit" 
          onClick={() => navigate("/statistics")}
          variant={isActivePage("/statistics") ? "outlined" : "text"}
        >
          Analytics
        </Button>
      )}
      {!isLoggedIn && (
        <>
          <Button color="inherit" onClick={() => navigate("/register")}>
            Register
          </Button>
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        </>
      )}
      {isLoggedIn && (
        <>
          <Button color="inherit" onClick={() => navigate("/profile")}>
            Profile
          </Button>
          {notifications > 0 && (
            <IconButton color="inherit" onClick={() => navigate("/orders")}>
              <Badge badgeContent={notifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          )}
          <Button color="inherit" onClick={() => logout()}>
            Logout
          </Button>
        </>
      )}
      {isLoggedIn && userType === "Buyer" && (
        <Button 
          color="inherit" 
          onClick={() => {
            fetchWalletBalance(); // Refresh balance when clicked
            navigate("/wallet");
          }}
          startIcon={<CurrencyRupeeIcon />}
          endIcon={<AccountBalanceWalletIcon />}
          sx={{ 
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Box component="span" id="BalNav" sx={{ mx: 1, fontWeight: 'bold' }}>
            {balanceLoading ? "..." : `₹${balance.toFixed(2)}`}
          </Box>
        </Button>
      )}
    </>
  );

  const renderMobileMenu = () => (
    <>
      <IconButton
        color="inherit"
        aria-label="menu"
        onClick={handleMenuOpen}
        edge="start"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {isLoggedIn && userType === "Buyer" && (
          <MenuItem onClick={() => handleNavigate("/buyerfood")}>
            Browse Food
          </MenuItem>
        )}
        {isLoggedIn && userType === "Vendor" && (
          <MenuItem onClick={() => handleNavigate("/vendorfood")}>
            Manage Food
          </MenuItem>
        )}
        {isLoggedIn && (
          <MenuItem onClick={() => handleNavigate("/orders")}>
            Orders {notifications > 0 && `(${notifications})`}
          </MenuItem>
        )}
        {isLoggedIn && userType === "Vendor" && (
          <MenuItem onClick={() => handleNavigate("/statistics")}>
            Analytics
          </MenuItem>
        )}
        {!isLoggedIn && (
          <>
            <MenuItem onClick={() => handleNavigate("/register")}>
              Register
            </MenuItem>
            <MenuItem onClick={() => handleNavigate("/login")}>
              Login
            </MenuItem>
          </>
        )}
        {isLoggedIn && (
          <>
            <MenuItem onClick={() => handleNavigate("/profile")}>
              Profile
            </MenuItem>
            {userType === "Buyer" && (
              <MenuItem onClick={() => {
                fetchWalletBalance(); // Refresh balance when clicked
                handleNavigate("/wallet");
              }}>
                Wallet: {balanceLoading ? "Loading..." : `₹${balance.toFixed(2)}`}
              </MenuItem>
            )}
            <MenuItem onClick={() => logout()}>
              Logout
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer", flexGrow: isMobile ? 1 : 0 }}
            onClick={() => navigate("/")}
          >
            SnackStack
          </Typography>
          {!isMobile && <Box sx={{ flexGrow: 1 }} />}
          {isMobile ? renderMobileMenu() : renderDesktopMenu()}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
