import { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserProfile, isAuthenticated } from "../../utils/auth";
import { API_ENDPOINTS } from "../../config/api";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import VendorAnalytics from '../analytics/VendorAnalytics';
const statlib = require('../../middlewares/statistics');

const Statistics = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [shopName, setShopName] = useState("");
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [vendorStats, setVendorStats] = useState({
        totalRevenue: 0,
        todayRevenue: 0,
        totalOrders: 0,
        todayOrders: 0,
        avgOrderValue: 0,
        topSellingItem: null
    });

    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                setLoading(true);
                
                // Get user profile
                const profileResult = await getUserProfile();
                if (profileResult.success && profileResult.user.userType === 'Vendor') {
                    setUser(profileResult.user);
                    setShopName(profileResult.user.shopName);
                    
                    // Get vendor orders using JWT-protected endpoint
                    const ordersResponse = await axios.get(API_ENDPOINTS.API_BASE_URL + "/order/vendororders");
                    const ordersData = ordersResponse.data;
                    setOrders(ordersData);

                    // Calculate vendor statistics
                    calculateVendorStats(ordersData);

                    // Get aggregated statistics for charts
                    // const statsResponse = await axios.get(API_ENDPOINTS.API_BASE_URL + "/statistics/");
                    // renderCharts(statsResponse.data);
                } else {
                    console.error("User is not a vendor or failed to fetch profile");
                }

            } catch (error) {
                console.log("Error fetching vendor data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated()) {
            fetchVendorData();
        } else {
            setLoading(false);
        }
    }, []);

    const calculateVendorStats = (ordersData) => {
        const today = new Date().toDateString();
        const completedOrders = ordersData.filter(order => order.status === "COMPLETED");
        const todayOrders = ordersData.filter(order => 
            new Date(order.placedTime).toDateString() === today
        );
        const todayCompletedOrders = todayOrders.filter(order => order.status === "COMPLETED");

        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.cost, 0);
        const todayRevenue = todayCompletedOrders.reduce((sum, order) => sum + order.cost, 0);
        const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

        // Find top selling item
        const itemCounts = {};
        completedOrders.forEach(order => {
            itemCounts[order.item] = (itemCounts[order.item] || 0) + order.quantity;
        });
        
        const topItem = Object.entries(itemCounts).reduce((max, [item, count]) => 
            count > (max.count || 0) ? { item, count } : max, {}
        );

        setVendorStats({
            totalRevenue,
            todayRevenue,
            totalOrders: ordersData.length,
            todayOrders: todayOrders.length,
            avgOrderValue,
            topSellingItem: topItem
        });
    };

    const getStatusColor = (status) => {
        const colorMap = {
            'PLACED': 'info',
            'ACCEPTED': 'primary',
            'COOKING': 'warning',
            'READY FOR PICKUP': 'secondary',
            'COMPLETED': 'success',
            'REJECTED': 'error'
        };
        return colorMap[status] || 'default';
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const renderMetricCard = (title, value, subtitle, color = "primary") => (
        <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" color={color} sx={{ fontWeight: 'bold', mb: 1 }}>
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Loading Analytics...
                </Typography>
                <LinearProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Please log in as a vendor to access analytics.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h3" gutterBottom align="center">
                Vendor Analytics Dashboard
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
                {shopName}
            </Typography>

            {/* Tabs Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="📊 Advanced Analytics" />
                    <Tab label="📈 Basic Statistics" />
                </Tabs>
            </Box>

            {/* Tab Content */}
            {tabValue === 0 && (
                <VendorAnalytics orders={orders} vendorStats={vendorStats} />
            )}

            {tabValue === 1 && (
                <Box>
                    {/* Key Metrics */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            {renderMetricCard("Total Revenue", `₹${vendorStats.totalRevenue.toLocaleString()}`, "All time", "success.main")}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {renderMetricCard("Today's Revenue", `₹${vendorStats.todayRevenue.toLocaleString()}`, new Date().toDateString(), "primary.main")}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {renderMetricCard("Total Orders", vendorStats.totalOrders, "All time", "info.main")}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {renderMetricCard("Today's Orders", vendorStats.todayOrders, "Active today", "warning.main")}
                        </Grid>
                    </Grid>

                    {/* Detailed Analytics */}
                    <Grid container spacing={4}>
                        {/* Top 5 Items */}
                        <Grid item xs={12} md={6} lg={4}>
                            <Card elevation={6} sx={{ height: '100%' }}>
                                <CardHeader 
                                    title="Top 5 Selling Items" 
                                    subheader={`${shopName} - All Time`}
                                    titleTypographyProps={{ variant: 'h6' }}
                                />
                                <CardContent>
                                    <Stack spacing={2}>
                                        {statlib.top5items(orders).map((item, index) => (
                                            <Box key={index} sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                p: 1,
                                                backgroundColor: index === 0 ? 'primary.light' : 'grey.50',
                                                borderRadius: 1,
                                                border: index === 0 ? '2px solid' : '1px solid',
                                                borderColor: index === 0 ? 'primary.main' : 'grey.300'
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Chip 
                                                        label={`#${index + 1}`} 
                                                        size="small" 
                                                        color={index === 0 ? "primary" : "default"}
                                                        sx={{ mr: 1, fontWeight: 'bold' }}
                                                    />
                                                    <Typography variant="body1" sx={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>
                                                        {item[0]}
                                                    </Typography>
                                                </Box>
                                                <Chip 
                                                    label={`${item[1]} sold`} 
                                                    color={index === 0 ? "primary" : "secondary"} 
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </Box>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Order Status Breakdown */}
                        <Grid item xs={12} md={6} lg={4}>
                            <Card elevation={6} sx={{ height: '100%' }}>
                                <CardHeader 
                                    title="Order Status Overview" 
                                    subheader={`${shopName} - Current Status`}
                                    titleTypographyProps={{ variant: 'h6' }}
                                />
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1">Total Orders</Typography>
                                            <Chip label={statlib.getOrdersPlaced(orders)} color="info" />
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1">Pending Orders</Typography>
                                            <Chip label={statlib.getPendingOrders(orders)} color="warning" />
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1">Completed Orders</Typography>
                                            <Chip label={statlib.getCompletedOrders(orders)} color="success" />
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body1">Average Order Value</Typography>
                                            <Chip label={`₹${vendorStats.avgOrderValue.toFixed(2)}`} color="primary" />
                                        </Box>
                                        {vendorStats.topSellingItem?.item && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1">Best Seller</Typography>
                                                <Chip 
                                                    label={vendorStats.topSellingItem.item} 
                                                    color="secondary" 
                                                    variant="outlined"
                                                />
                                            </Box>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Recent Orders Activity */}
                        <Grid item xs={12} lg={4}>
                            <Card elevation={6} sx={{ height: '100%' }}>
                                <CardHeader 
                                    title="Recent Orders" 
                                    subheader="Latest 5 orders"
                                    titleTypographyProps={{ variant: 'h6' }}
                                />
                                <CardContent>
                                    <Stack spacing={2}>
                                        {orders.slice(0, 5).map((order, index) => (
                                            <Box key={order._id} sx={{ 
                                                p: 1, 
                                                border: '1px solid', 
                                                borderColor: 'grey.300',
                                                borderRadius: 1,
                                                backgroundColor: 'grey.50'
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {order.item}
                                                    </Typography>
                                                    <Chip 
                                                        label={order.status} 
                                                        color={getStatusColor(order.status)} 
                                                        size="small"
                                                    />
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Qty: {order.quantity} • ₹{order.cost} • {new Date(order.placedTime).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default Statistics;