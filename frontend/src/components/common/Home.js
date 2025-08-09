import { Stack, Grid, Typography, Card, CardContent, Box, Button, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import { isAuthenticated, getUserProfile } from "../../utils/auth";

const Home = (props) => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    orderCount: 0,
    balance: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  
  const authenticated = isAuthenticated();
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    if (authenticated && userType) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [authenticated, userType]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get user profile first
      const profileResult = await getUserProfile();
      if (profileResult.success) {
        setUserInfo(profileResult.user);
        await fetchUserStats(profileResult.user);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async (user) => {
    try {
      if (user.userType === "Buyer") {
        // Fetch wallet balance using protected endpoint
        try {
          const walletResponse = await axios.get(API_ENDPOINTS.GET_BALANCE);
          setUserStats(prev => ({ ...prev, balance: walletResponse.data.balance || 0 }));
        } catch (err) {
          console.log("Could not fetch wallet balance:", err.message);
          setUserStats(prev => ({ ...prev, balance: 0 }));
        }
        
        // Fetch order count using protected endpoint
        try {
          const ordersResponse = await axios.get(API_ENDPOINTS.MY_ORDERS);
          setUserStats(prev => ({ ...prev, orderCount: ordersResponse.data?.length || 0 }));
        } catch (err) {
          console.log("Could not fetch orders:", err.message);
          setUserStats(prev => ({ ...prev, orderCount: 0 }));
        }
      } else if (user.userType === "Vendor") {
        // Fetch vendor stats using protected endpoint
        try {
          const ordersResponse = await axios.get(API_ENDPOINTS.VENDOR_ORDERS);
          const orders = ordersResponse.data || [];
          const revenue = orders.reduce((sum, order) => sum + (order.cost || 0), 0);
          setUserStats(prev => ({ 
            ...prev, 
            orderCount: orders.length, 
            revenue: revenue 
          }));
        } catch (err) {
          console.log("Could not fetch vendor stats:", err.message);
          setUserStats(prev => ({ ...prev, orderCount: 0, revenue: 0 }));
        }
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      // Don't throw error, just set default values
      setUserStats({ orderCount: 0, balance: 0, revenue: 0 });
    }
  };

  const renderWelcomeMessage = () => {
    if (!authenticated) {
      return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 2, color: 'text.secondary' }}>
            Please Login to Continue
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/login')}
            sx={{ mr: 2 }}
          >
            Login
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </Box>
      );
    }

    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h3" component="h2" sx={{ 
          mb: 1, 
          color: 'primary.main',
          fontWeight: 'bold'
        }}>
          Welcome back, {userInfo?.name || "User"}! 🎉
        </Typography>
        <Typography variant="h6" component="h3" sx={{
          mb: 2,
          color: 'text.secondary',
          textTransform: 'capitalize'
        }}>
          You're logged in as a {userType?.toLowerCase() || "user"}
        </Typography>
        <Divider sx={{ maxWidth: 300, mx: 'auto', mb: 3 }} />
        
        {/* Quick Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {userType === "Buyer" && (
            <>
              <Button 
                variant="contained" 
                onClick={() => navigate('/buyerfood')}
                sx={{ minWidth: 120 }}
              >
                Browse Food
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/wallet')}
                sx={{ minWidth: 120 }}
              >
                My Wallet
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/orders')}
                sx={{ minWidth: 120 }}
              >
                My Orders
              </Button>
            </>
          )}
          {userType === "Vendor" && (
            <>
              <Button 
                variant="contained" 
                onClick={() => navigate('/vendorfood')}
                sx={{ minWidth: 120 }}
              >
                Manage Food
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/statistics')}
                sx={{ minWidth: 120 }}
              >
                Analytics
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/orders')}
                sx={{ minWidth: 120 }}
              >
                Orders
              </Button>
            </>
          )}
        </Box>
      </Box>
    );
  };

  const renderQuickStats = () => {
    if (!authenticated) return null;

    return (
      <Box sx={{ marginTop: '3rem', maxWidth: '900px', margin: '3rem auto 0' }}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold' }}>
          Your Dashboard
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={4} sx={{ 
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)', 
                boxShadow: 6 
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {userType === "Buyer" ? "My Orders" : "Today's Orders"}
                </Typography>
                <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  {loading ? "..." : userStats.orderCount}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {userType === "Buyer" ? "Total orders placed" : "Orders received today"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {userType === "Buyer" && (
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={4} sx={{ 
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: 6 
                }
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Wallet Balance
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    ₹{loading ? "..." : userStats.balance}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Available to spend
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {userType === "Vendor" && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={4} sx={{ 
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: 6 
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Revenue Today
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      ₹{loading ? "..." : userStats.revenue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Earnings today
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={4} sx={{ 
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: 6 
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Active Items
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                      {loading ? "..." : "12"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Items in your menu
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    );
  };

  return (
    <div>
      <Grid container component="main" sx={{ minHeight: '80vh' }} direction="column" justifyContent="center" alignItems="center">
        <Grid item xs={12} sx={{ width: '100%', maxWidth: 1200 }}>
          <Typography variant="h2" component="h1" sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 2,
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🍽️ SnackStack
          </Typography>
          <Typography variant="h5" sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mb: 4,
            fontSize: { xs: '1.2rem', md: '1.5rem' }
          }}>
            Your Ultimate Food Ordering Platform
          </Typography>
          
          {renderWelcomeMessage()}
          {renderQuickStats()}
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
