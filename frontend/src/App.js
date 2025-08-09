import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Alert, Snackbar } from '@mui/material';
import { initializeAuth, isAuthenticated } from './utils/auth';

// Create a modern theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true, allowedUserTypes = [] }) => {
  const authenticated = isAuthenticated();
  const userType = localStorage.getItem("userType");

  if (requireAuth && !authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && authenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Something went wrong. Please refresh the page or try again later.
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <div className="container">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </Box>
    </Box>
  );
};

function App() {
  const [userMail, setUserMail] = useState("");
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    // Initialize authentication on app start
    initializeAuth();
    
    // Global error handler
    const handleGlobalError = (event) => {
      console.error('Global error:', event.error);
      setGlobalError('An unexpected error occurred. Please try again.');
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleGlobalError);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
  }, []);

  const handleCloseError = () => {
    setGlobalError("");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route 
              path="register" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />

            {/* Protected Routes - Require Authentication */}
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="orders" 
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } 
            />

            {/* Buyer-only Routes */}
            <Route 
              path="buyerfood" 
              element={
                <ProtectedRoute allowedUserTypes={["Buyer"]}>
                  <BuyerFood />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="wallet" 
              element={
                <ProtectedRoute allowedUserTypes={["Buyer"]}>
                  <Wallet />
                </ProtectedRoute>
              } 
            />

            {/* Vendor-only Routes */}
            <Route 
              path="vendorfood" 
              element={
                <ProtectedRoute allowedUserTypes={["Vendor"]}>
                  <VendorFood />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="vendor-dashboard" 
              element={
                <ProtectedRoute allowedUserTypes={["Vendor"]}>
                  <VendorFood />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="statistics" 
              element={
                <ProtectedRoute allowedUserTypes={["Vendor"]}>
                  <Statistics />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>

        {/* Global Error Snackbar */}
        <Snackbar
          open={!!globalError}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {globalError}
          </Alert>
        </Snackbar>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
