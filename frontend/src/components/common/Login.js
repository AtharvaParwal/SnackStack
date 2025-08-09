import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/auth";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Paper from "@mui/material/Paper";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const Login = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [buzz, setBuzz] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loginType, setLoginType] = useState("buyer"); // New state for login type

    const onChangeEmail = (event) => {
        setEmail(event.target.value);
        if (buzz) setBuzz(false); // Clear error when user starts typing
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value);
        if (buzz) setBuzz(false);
    };

    const resetInputs = () => {
        setEmail("");
        setPassword("");
    };

    const handleLoginTypeChange = (event, newLoginType) => {
        if (newLoginType !== null) {
            setLoginType(newLoginType);
            setBuzz(false);
            setErrorMessage("");
        }
    };

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage("");

        // Validation
        if (!email || !password) {
            setErrorMessage("Please fill in all fields");
            setBuzz(true);
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address");
            setBuzz(true);
            resetInputs();
            setLoading(false);
            return;
        }

        try {
            console.log("Attempting login:", { email: email.toLowerCase().trim(), loginType });
            
            const result = await login(email.toLowerCase().trim(), password, loginType);
            
            if (result.success) {
                console.log("Login successful:", result);
                setBuzz(false);
                
                // Force a page refresh to ensure auth state is properly loaded
                if (result.userType === "Vendor" || result.userType === "vendor") {
                    window.location.href = "/vendorfood";
                } else {
                    window.location.href = "/";
                }
            } else {
                console.error("Login failed:", result.error);
                setErrorMessage(result.error);
                setBuzz(true);
                resetInputs();
            }
        } catch (error) {
            console.error("Unexpected login error:", error);
            setErrorMessage("Login failed. Please try again later.");
            setBuzz(true);
            resetInputs();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container align={"center"} spacing={2} paddingX={50}>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {buzz ? (
                    <Alert severity="error">
                        {errorMessage || "Error! Please fill all the required fields"}
                    </Alert>
                ) : ""}
            </Stack>
            <Grid item xs={12}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Login to SnackStack
                </Typography>
                
                {/* Login Type Toggle */}
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={4} sx={{ mb: 3 }}>
                    <ToggleButtonGroup
                        color="primary"
                        value={loginType}
                        exclusive
                        onChange={handleLoginTypeChange}
                    >
                        <ToggleButton value="buyer">Buyer Login</ToggleButton>
                        <ToggleButton value="vendor">Vendor Login</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Grid>
            <Paper elevation={8} sx={{ width: 600, paddingTop: 10, paddingBottom: 5, paddingLeft: 15, paddingRight: 15, borderRadius: 2, lineHeight: 5 }}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={onChangeEmail}
                        disabled={loading}
                        type="email"
                        autoComplete="email"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={onChangePassword}
                        disabled={loading}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button 
                        variant="contained" 
                        onClick={onSubmit} 
                        size="large"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? "Logging in..." : `Login as ${loginType.charAt(0).toUpperCase() + loginType.slice(1)}`}
                    </Button>
                </Grid>
            </Paper>
        </Grid >
    );
};

export default Login;
