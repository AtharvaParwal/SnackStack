import { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { getUserProfile, isAuthenticated } from "../../utils/auth";
import { API_ENDPOINTS } from "../../config/api";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import ListItem from "@mui/material/ListItem";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import Fab from '@mui/material/Fab';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, Grid, Button, Paper, Accordion, AccordionSummary, AccordionDetails, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { pink, red, lightBlue, green, orange } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ClearIcon from '@mui/icons-material/Clear';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LinearProgress from '@mui/material/LinearProgress';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { init, send } from '@emailjs/browser'
import OrderTracker from './OrderTracker';
init('user_vNBAStcuIRCdghDxao5wF' );

// const statlib = require('../../middlewares/statistics');

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert icon={false} elevation={6} ref={ref} variant="filled" {...props} />;
});

const BuyerOrder = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [rating, setRating] = useState([]);
    const [open, setOpen] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState({});

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleOrderExpand = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    useEffect(() => {
        const fetchOrdersData = async () => {
            try {
                setLoading(true);
                
                // Get user profile
                const profileResult = await getUserProfile();
                if (profileResult.success) {
                    setUser(profileResult.user);
                    
                    // Get orders using JWT-protected endpoint
                    const ordersResponse = await axios.get(API_ENDPOINTS.API_BASE_URL + "/order/myorders");
                    setOrders(ordersResponse.data);
                } else {
                    console.error("Failed to fetch user profile");
                }
                
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated()) {
            fetchOrdersData();
        } else {
            setLoading(false);
        }
    }, []);

    const printAddons = (addons) => {
        let addonsList = [];
        addons.forEach((addon, index) => {
            addonsList.push(<Chip key={index} label={addon} color="warning" variant="outlined" sx={{ mr: 1, mb: 1 }} />);
        });
        return addonsList;
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'PLACED': 'info',
            'ACCEPTED': 'primary',
            'COOKING': 'warning',
            'READY FOR PICKUP': 'secondary',
            'COMPLETED': 'success',
            'REJECTED': 'error'
        };
        return statusColors[status] || 'default';
    };

    const completeOrder = (e, order, ind) => {
        e.preventDefault();
        const orderInfo = {
            id: order._id,
            status: "COMPLETED"
        };
        axios
            .post(API_ENDPOINTS.UPDATE_ORDER_STATUS, orderInfo)
            .then((response) => {
                console.log(response);
                let rating_array = [...rating];
                rating_array[ind] = 2;
                setRating(rating_array);
                // Refresh orders
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const updateRating = (e, value, order, ind) => {
        e.preventDefault();
        const orderInfo = {
            id: order.item_id,
            rating: value
        };
        console.log(orderInfo);
        axios
            .post(API_ENDPOINTS.UPDATE_FOOD_RATING, orderInfo)
            .then((response) => {
                console.log(response);
                let rating_array = [...rating];
                rating_array[ind] = 3;
                setRating(rating_array);
                const info = {
                    id: order._id
                }
                axios
                    .post(API_ENDPOINTS.MARK_ORDER_RATED, info)
                    .then((response) => {
                        console.log(response);
                        handleClick();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <Typography variant="h6">Loading your orders...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
            <Typography sx={{ textAlign: 'center', paddingBottom: 4 }} variant="h3" gutterBottom>
                My Orders
            </Typography>
            
            {orders.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No orders found. Start ordering some delicious food!
                    </Typography>
                </Paper>
            ) : (
                orders.map((order, index) => (
                    <Accordion 
                        key={order._id} 
                        expanded={expandedOrders[order._id] || false}
                        onChange={() => handleOrderExpand(order._id)}
                        sx={{ mb: 2, border: 1, borderColor: 'divider' }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                    <Typography variant="h6" sx={{ minWidth: 200 }}>
                                        {order.item}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {order.canteen}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ₹{order.cost}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Qty: {order.quantity}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Chip 
                                        label={order.status} 
                                        color={getStatusColor(order.status)}
                                        variant="filled"
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(order.placedTime).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>
                        </AccordionSummary>
                        
                        <AccordionDetails>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Order Details
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Item:</strong> {order.item}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Vendor:</strong> {order.canteen}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Quantity:</strong> {order.quantity}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Total Cost:</strong> ₹{order.cost}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Placed At:</strong> {new Date(order.placedTime).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        
                                        {order.addons && order.addons.length > 0 && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body1" gutterBottom>
                                                    <strong>Add-ons:</strong>
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {printAddons(order.addons)}
                                                </Box>
                                            </Box>
                                        )}

                                        {order.status === 'READY FOR PICKUP' && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<ShoppingBagIcon />}
                                                onClick={(e) => completeOrder(e, order, index)}
                                                sx={{ mb: 2 }}
                                            >
                                                Mark as Picked Up
                                            </Button>
                                        )}

                                        {order.status === 'COMPLETED' && !order.rated && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body1" gutterBottom>
                                                    Rate this order:
                                                </Typography>
                                                <Rating
                                                    name={`rating-${order._id}`}
                                                    defaultValue={0}
                                                    onChange={(event, newValue) => {
                                                        updateRating(event, newValue, order, index);
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        {order.rated && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2" color="success.main">
                                                    Thank you for rating this order!
                                                </Typography>
                                                <Rating
                                                    name={`rating-readonly-${order._id}`}
                                                    value={order.rating || 0}
                                                    readOnly
                                                />
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <OrderTracker order={order} />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
            
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Order Rated Successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}

const VendorOrder = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState([]);
    const [open, setOpen] = useState(false);
    const [erropen, setErropen] = useState(false);
    const [count, setCount] = useState(0);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [statusFilter, setStatusFilter] = useState('ALL');

    const stat_index = {
        'PLACED': 0,
        'ACCEPTED': 1,
        'COOKING': 2,
        'READY FOR PICKUP': 3,
        'COMPLETED': 4,
        'REJECTED': 5
    }

    const stat_names = [
        'PLACED',
        'ACCEPTED',
        'COOKING',
        'READY FOR PICKUP',
        'COMPLETED',
        'REJECTED'
    ]

    const getStatusColor = (status) => {
        const statusColors = {
            'PLACED': 'warning',
            'ACCEPTED': 'info',
            'COOKING': 'primary',
            'READY FOR PICKUP': 'secondary',
            'COMPLETED': 'success',
            'REJECTED': 'error'
        };
        return statusColors[status] || 'default';
    };

    const getNextStatusAction = (currentStatus) => {
        const actions = {
            'PLACED': 'Accept Order',
            'ACCEPTED': 'Start Cooking',
            'COOKING': 'Ready for Pickup',
            'READY FOR PICKUP': 'Complete Order'
        };
        return actions[currentStatus] || null;
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleerrClose = () => {
        setErropen(false);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleOrderExpand = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    useEffect(() => {
        const fetchVendorOrders = async () => {
            try {
                setLoading(true);
                
                // Get user profile
                const profileResult = await getUserProfile();
                if (profileResult.success && profileResult.user.userType === 'Vendor') {
                    setUser(profileResult.user);
                    
                    // Get vendor orders using JWT-protected endpoint
                    const ordersResponse = await axios.get(API_ENDPOINTS.API_BASE_URL + "/order/vendororders");
                    const ordersData = ordersResponse.data;
                    setOrders(ordersData);
                    
                    // Initialize status array
                    let status_array = [];
                    for (let i = 0; i < ordersData.length; i++) {
                        status_array.push(stat_index[ordersData[i].status]);
                    }
                    setStatus(status_array);
                } else {
                    console.error("User is not a vendor or failed to fetch profile");
                }
                
            } catch (error) {
                console.error("Error fetching vendor orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated()) {
            fetchVendorOrders();
        } else {
            setLoading(false);
        }
    }, []);

    const printAddons = (addons) => {
        let addonsList = [];
        addons.forEach((addon, index) => {
            addonsList.push(<Chip key={index} label={addon} color="warning" variant="outlined" sx={{ mr: 1, mb: 1 }} />);
        });
        return addonsList;
    };

    const moveToNextStage = (e, order, ind) => {
        e.preventDefault();

        if (status[ind] === 0 && count >= 10) {
            setErropen(true);
            return;
        }

        const orderInfo = {
            id: order._id,
            status: stat_names[status[ind] + 1]
        };
        axios
            .post(API_ENDPOINTS.UPDATE_ORDER_STATUS, orderInfo)
            .then((response) => {
                if (status[ind] === 0)
                    setCount(count + 1);
                else if (status[ind] === 2)
                    setCount(count - 1);

                let status_array = [...status];
                status_array[ind]++;
                if (status_array[ind] === 1) {
                    const data = {
                        email: order.email,
                        status: stat_names[status_array[ind]],
                        Vendor: order.canteen,
                        message: "Your order has been sucessfully accepted by the vendor. Please wait for the vendor to prepare the food. You can track the order status in the 'My Orders' section. Thank you for using Canteen Portal."
                    }

                    send("service_su4zcom", "template_tnyblq3", data).then(res => {
                        console.log(res);
                    }).catch(err => {
                        console.log(err);
                    });
                }
                setStatus(status_array);
                
                // Update the order in the orders array
                const updatedOrders = [...orders];
                updatedOrders[ind].status = stat_names[status_array[ind]];
                setOrders(updatedOrders);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const rejectOrder = (e, order, ind) => {
        e.preventDefault();
        const orderInfo = {
            id: order._id,
            status: "REJECTED"
        };
        axios
            .post(API_ENDPOINTS.UPDATE_ORDER_STATUS, orderInfo)
            .then((response) => {
                console.log(response);
                let status_array = [...status];
                status_array[ind] = 5;
                const data = {
                    email: order.email,
                    status: stat_names[status_array[ind]],
                    Vendor: order.canteen,
                    message: "Your order has been rejected by the vendor. Please try again. Your money will be refunded shortly. Thank you for using Canteen Portal."
                }
                send("service_su4zcom", "template_tnyblq3", data).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
                setStatus(status_array);
                
                // Update the order in the orders array
                const updatedOrders = [...orders];
                updatedOrders[ind].status = "REJECTED";
                setOrders(updatedOrders);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                const walletInfo = {
                    email: order.email,
                    balance: order.cost
                };
                axios
                    .post(API_ENDPOINTS.ADD_BALANCE, walletInfo)
                    .then((response) => {
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.post(API_ENDPOINTS.UPDATE_ORDER_STATUS, {
                id: orderId,
                status: newStatus
            });
            
            // Update local state
            const updatedOrders = orders.map(order => 
                order._id === orderId ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);
            
            // Send notification email for acceptance
            if (newStatus === 'ACCEPTED') {
                const order = orders.find(o => o._id === orderId);
                const data = {
                    email: order.email,
                    status: newStatus,
                    Vendor: order.canteen,
                    message: "Your order has been accepted by the vendor. Please wait for the vendor to prepare the food. You can track the order status in the 'My Orders' section. Thank you for using Canteen Portal."
                };
                
                send("service_su4zcom", "template_tnyblq3", data).catch(err => {
                    console.log('Email notification failed:', err);
                });
            }
            
            handleClick();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const filteredOrders = orders.filter(order => 
        statusFilter === 'ALL' || order.status === statusFilter
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <Typography variant="h6">Loading orders...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
            <Typography sx={{ textAlign: 'center', paddingBottom: 4 }} variant="h3" gutterBottom>
                Received Orders
            </Typography>
            
            {/* Status Filter */}
            <Box sx={{ mb: 3 }}>
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Filter by Status"
                    >
                        <MenuItem value="ALL">All Orders</MenuItem>
                        <MenuItem value="PLACED">Placed</MenuItem>
                        <MenuItem value="ACCEPTED">Accepted</MenuItem>
                        <MenuItem value="COOKING">Cooking</MenuItem>
                        <MenuItem value="READY FOR PICKUP">Ready for Pickup</MenuItem>
                        <MenuItem value="COMPLETED">Completed</MenuItem>
                        <MenuItem value="REJECTED">Rejected</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {filteredOrders.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        {statusFilter === 'ALL' ? 
                            'No orders found.' : 
                            `No ${statusFilter.toLowerCase()} orders found.`
                        }
                    </Typography>
                </Paper>
            ) : (
                filteredOrders.map((order, index) => {
                    const actualIndex = orders.findIndex(o => o._id === order._id);
                    return (
                        <Accordion 
                            key={order._id}
                            expanded={expandedOrders[order._id] || false}
                            onChange={() => handleOrderExpand(order._id)}
                            sx={{ 
                                mb: 2, 
                                border: 1, 
                                borderColor: 'divider',
                                borderLeft: `4px solid ${
                                    order.status === 'PLACED' ? orange[500] :
                                    order.status === 'ACCEPTED' ? lightBlue[500] :
                                    order.status === 'COOKING' ? orange[700] :
                                    order.status === 'READY FOR PICKUP' ? lightBlue[700] :
                                    order.status === 'COMPLETED' ? green[500] :
                                    red[500]
                                }`
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                        <Typography variant="h6" sx={{ minWidth: 200 }}>
                                            {order.item}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Customer: {order.email}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ₹{order.cost}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Qty: {order.quantity}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip 
                                            label={order.status} 
                                            color={getStatusColor(order.status)}
                                            variant="filled"
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(order.placedTime).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Order Details
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body1" gutterBottom>
                                                    <strong>Item:</strong> {order.item}
                                                </Typography>
                                                <Typography variant="body1" gutterBottom>
                                                    <strong>Customer:</strong> {order.email}
                                                </Typography>
                                                <Typography variant="body1" gutterBottom>
                                                    <strong>Quantity:</strong> {order.quantity}
                                                </Typography>
                                                <Typography variant="body1" gutterBottom>
                                                    <strong>Total Cost:</strong> ₹{order.cost}
                                                </Typography>
                                                <Typography variant="body1" gutterBottom>
                                                    <strong>Placed At:</strong> {new Date(order.placedTime).toLocaleString()}
                                                </Typography>
                                            </Box>
                                            
                                            {order.addons && order.addons.length > 0 && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body1" gutterBottom>
                                                        <strong>Add-ons:</strong>
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {printAddons(order.addons)}
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Action Buttons */}
                                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                                {order.status === 'PLACED' && (
                                                    <>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={(e) => moveToNextStage(e, order, actualIndex)}
                                                        >
                                                            Accept Order
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            onClick={(e) => rejectOrder(e, order, actualIndex)}
                                                        >
                                                            Reject Order
                                                        </Button>
                                                    </>
                                                )}
                                                
                                                {(['ACCEPTED', 'COOKING'].includes(order.status)) && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={(e) => moveToNextStage(e, order, actualIndex)}
                                                    >
                                                        {getNextStatusAction(order.status)}
                                                    </Button>
                                                )}

                                                {order.status === 'READY FOR PICKUP' && (
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        onClick={(e) => moveToNextStage(e, order, actualIndex)}
                                                    >
                                                        Mark as Completed
                                                    </Button>
                                                )}
                                            </Box>

                                            {/* Quick Status Update */}
                                            {!['COMPLETED', 'REJECTED'].includes(order.status) && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Typography variant="body2" gutterBottom>
                                                        Quick status update:
                                                    </Typography>
                                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                                        <Select
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                        >
                                                            <MenuItem value="PLACED">Placed</MenuItem>
                                                            <MenuItem value="ACCEPTED">Accepted</MenuItem>
                                                            <MenuItem value="COOKING">Cooking</MenuItem>
                                                            <MenuItem value="READY FOR PICKUP">Ready for Pickup</MenuItem>
                                                            <MenuItem value="COMPLETED">Completed</MenuItem>
                                                            <MenuItem value="REJECTED">Rejected</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            )}
                                        </Paper>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={6}>
                                        <OrderTracker order={order} />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    );
                })
            )}
            
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Order Status Updated Successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={erropen} autoHideDuration={3000} onClose={handleerrClose}>
                <Alert onClose={handleerrClose} severity="error" sx={{ width: '100%' }}>
                    No Space Available! Move other orders beyond cooking stage first
                </Alert>
            </Snackbar>
        </Box>
    );
}


const Orders = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const profileResult = await getUserProfile();
                if (profileResult.success) {
                    setUser(profileResult.user);
                } else {
                    console.error("Failed to fetch user profile");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated()) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <Typography variant="h4" align="center" gutterBottom>
                Loading...
            </Typography>
        );
    }

    if (!user) {
        return (
            <Typography variant="h4" align="center" gutterBottom>
                Please log in to access this page.
            </Typography>
        );
    }

    return (
        <div>
            {user.userType === "Buyer" ? <BuyerOrder /> : <VendorOrder />}
        </div>
    );
}

export default Orders;