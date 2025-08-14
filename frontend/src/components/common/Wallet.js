import { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { getUserProfile, triggerBalanceRefresh } from "../../utils/auth";
import { API_ENDPOINTS } from "../../config/api";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Wallet = (props) => {
    const [userInfo, setUserInfo] = useState(null);
    const [balance, setBalance] = useState(0);
    const [value, setValue] = useState("");
    const [buzz, setBuzz] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingBalance, setFetchingBalance] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setFetchingBalance(true);
                const profileResult = await getUserProfile();
                if (profileResult.success) {
                    setUserInfo(profileResult.user);
                    await fetchBalance();
                } else {
                    setErrorMessage("Failed to load user data");
                    setBuzz(true);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setErrorMessage("Failed to load user data");
                setBuzz(true);
            } finally {
                setFetchingBalance(false);
            }
        };

        fetchUserData();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.GET_BALANCE);
            setBalance(response.data.balance || 0);
        } catch (error) {
            console.error("Error fetching balance:", error);
            setErrorMessage("Failed to fetch balance");
            setBuzz(true);
            setBalance(0);
        }
    };

    const onChangeValue = (e) => {
        const inputValue = e.target.value;
        // Only allow positive numbers
        if (inputValue === "" || (Number(inputValue) > 0 && !isNaN(inputValue))) {
            setValue(inputValue);
            if (buzz) setBuzz(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!value || Number(value) <= 0) {
            setErrorMessage("Please enter a valid amount greater than 0");
            setBuzz(true);
            return;
        }

        setLoading(true);
        
        try {
            const amount = Math.floor(Number(value));
            
            console.log("Adding money to wallet:", { amount });
            const response = await axios.post(API_ENDPOINTS.ADD_BALANCE, { amount });
            console.log("Money added successfully:", response.data);
            
            setBalance(response.data.balance);
            setBuzz(false);
            setOpen(true);
            setValue("");
            setErrorMessage("");
            
            // Trigger balance refresh in Navbar
            triggerBalanceRefresh();
            
        } catch (error) {
            console.error("Error adding money:", error);
            setErrorMessage(error.response?.data?.error || "Failed to add money. Please try again.");
            setBuzz(true);
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo && !fetchingBalance) {
        return (
            <Grid container justifyContent="center" sx={{ mt: 4 }}>
                <Typography variant="h6" color="error">
                    Please log in to access your wallet
                </Typography>
            </Grid>
        );
    }

    if (fetchingBalance) {
        return (
            <Grid container justifyContent="center" sx={{ mt: 4 }}>
                <CircularProgress size={60} />
            </Grid>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                💰 Wallet Management
            </Typography>

            {buzz && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {errorMessage || "Error! Please fill all the required fields"}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Current Balance Card */}
                <Grid item xs={12} md={6}>
                    <Card elevation={8} sx={{ 
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        color: 'white',
                        minHeight: 200
                    }}>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <AccountBalanceWalletIcon sx={{ fontSize: 60, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Current Balance
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                ₹{balance}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                                Available for orders
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Add Money Card */}
                <Grid item xs={12} md={6}>
                    <Card elevation={8} sx={{ minHeight: 200 }}>
                        <CardContent sx={{ py: 4 }}>
                            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
                                <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Add Money
                            </Typography>
                            
                            <Stack spacing={3} component="form" onSubmit={onSubmit}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Amount to Add"
                                    variant="outlined"
                                    value={value}
                                    onChange={onChangeValue}
                                    placeholder="Enter amount in Rupees"
                                    type="number"
                                    inputProps={{ min: 1, step: 1 }}
                                    disabled={loading}
                                    helperText="Minimum ₹1 (For testing purposes - adds money directly)"
                                />
                                
                                <Button 
                                    variant="contained" 
                                    type="submit"
                                    size="large"
                                    disabled={loading || !value || Number(value) <= 0}
                                    startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                                    fullWidth
                                    sx={{ py: 1.5 }}
                                >
                                    {loading ? "Adding..." : "Add Money Instantly"}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Add Options */}
                <Grid item xs={12}>
                    <Card elevation={4}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom align="center">
                                Quick Add Options
                            </Typography>
                            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                                {[100, 200, 500, 1000].map((amount) => (
                                    <Button
                                        key={amount}
                                        variant="outlined"
                                        onClick={() => setValue(amount.toString())}
                                        disabled={loading}
                                        sx={{ minWidth: 80 }}
                                    >
                                        ₹{amount}
                                    </Button>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    ₹{value && Math.floor(Number(value))} added to your wallet successfully! 🎉
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Wallet;

