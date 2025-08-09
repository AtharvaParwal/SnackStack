import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

// Register as a buyer or vendor
const Register = (props) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [shopName, setShopName] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [buzz, setBuzz] = useState(false);
  const [formType, setFormType] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alignment, setAlignment] = useState('buyer');

  const batchOptions = ["UG1", "UG2", "UG3", "UG4", "UG5"];

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      setFormType(newAlignment);
      resetInputs();
    }
  };

  const onChangeUsername = (event) => {
    setName(event.target.value);
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangeContact = (event) => {
    const value = event.target.value;
    // Only allow numbers and limit to 10 digits
    if (value === "" || (/^\d+$/.test(value) && value.length <= 10)) {
      setContact(value);
    }
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onChangeAge = (event) => {
    const value = event.target.value;
    if (value === "" || (Number(value) > 0 && Number(value) <= 120)) {
      setAge(value);
    }
  };

  const onChangeBatchNumber = (event) => {
    setBatchNumber(event.target.value);
  };

  const onChangeShopName = (event) => {
    setShopName(event.target.value);
  };

  const onChangeOpenTime = (event) => {
    setOpenTime(event.target.value);
  };

  const onChangeCloseTime = (event) => {
    setCloseTime(event.target.value);
  };

  const resetInputs = () => {
    setName("");
    setEmail("");
    setContact("");
    setPassword("");
    setAge("");
    setBatchNumber("");
    setShopName("");
    setOpenTime("");
    setCloseTime("");
    setBuzz(false);
    setErrorMessage("");
  };

  // Test API connectivity
  const testConnection = async () => {
    try {
      console.log("Testing API connection...");
      const response = await axios.get(API_ENDPOINTS.TEST_API);
      console.log("API connection successful:", response.data);
      alert(`API Connection Test: ${response.data.message}`);
    } catch (error) {
      console.error("API connection failed:", error);
      alert(`API Connection Failed: ${error.message}`);
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validateTime = (time) => {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  };

  const validateBuyerForm = () => {
    if (!name || !email || !contact || !password || !age || !batchNumber) {
      setErrorMessage("Please fill in all required fields");
      return false;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    if (contact.length !== 10) {
      setErrorMessage("Contact number must be 10 digits");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return false;
    }
    if (Number(age) < 16) {
      setErrorMessage("Age must be at least 16 years");
      return false;
    }
    return true;
  };

  const validateVendorForm = () => {
    if (!name || !email || !contact || !password || !shopName || !openTime || !closeTime) {
      setErrorMessage("Please fill in all required fields");
      return false;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    if (contact.length !== 10) {
      setErrorMessage("Contact number must be 10 digits");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return false;
    }
    if (!validateTime(openTime) || !validateTime(closeTime)) {
      setErrorMessage("Please enter valid time in HH:MM format (24-hour)");
      return false;
    }
    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    
    if (!validateBuyerForm()) {
      setBuzz(true);
      setLoading(false);
      return;
    }

    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      contact: contact,
      password: password,
      age: Number(age),
      batchNumber: batchNumber
    };

    try {
      console.log("Sending buyer registration request:", newUser);
      console.log("API endpoint:", API_ENDPOINTS.BUYER_REGISTER);
      
      const response = await axios.post(API_ENDPOINTS.BUYER_REGISTER, newUser);
      console.log("Registration successful:", response.data);
      
      // Show success message
      alert(`Successfully registered buyer: ${response.data.name}`);
      
      setBuzz(false);
      resetInputs();
      
      // Navigate to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else if (error.message) {
        setErrorMessage(`Network error: ${error.message}`);
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
      setBuzz(true);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitVendor = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!validateVendorForm()) {
      setBuzz(true);
      setLoading(false);
      return;
    }

    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      contact: contact,
      password: password,
      shopName: shopName.trim(),
      openTime: openTime,
      closeTime: closeTime
    };

    try {
      const response = await axios.post(API_ENDPOINTS.VENDOR_REGISTER, newUser);
      console.log("Vendor registration successful:", response.data);
      
      // Show success message
      alert(`Successfully registered vendor: ${response.data.name}`);
      
      setBuzz(false);
      resetInputs();
      
      // Navigate to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
      setBuzz(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container align={"center"} spacing={2} paddingX={70} alignItems="center" justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h3" component="h1" gutterBottom>
          Join SnackStack
        </Typography>
        
        {/* Test API Connection Button */}
        <Button 
          variant="outlined" 
          onClick={testConnection} 
          style={{ marginBottom: 8, marginRight: 8 }}
        >
          Test API Connection
        </Button>
        
        {/* Go to Login Button */}
        <Button 
          variant="outlined" 
          color="secondary"
          onClick={() => navigate('/login')} 
          style={{ marginBottom: 8 }}
        >
          Already have an account? Login
        </Button>
        
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={4}>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="buyer">Register as Buyer</ToggleButton>
            <ToggleButton value="vendor">Register as Vendor</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Grid>

      {formType === "buyer" ? (
        <>
          <Stack sx={{ width: '100%' }} spacing={2}>
            {buzz ? (
              <Alert severity="error">
                {errorMessage || "Error! Please fill all the required fields with valid credentials"}
              </Alert>
            ) : ""}
          </Stack>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom>
              Buyer Registration
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Full Name"
              variant="outlined"
              value={name}
              onChange={onChangeUsername}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Email"
              variant="outlined"
              value={email}
              onChange={onChangeEmail}
              type="email"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Contact Number"
              variant="outlined"
              value={contact}
              onChange={onChangeContact}
              inputProps={{ maxLength: 10 }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={onChangePassword}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Age"
              variant="outlined"
              value={age}
              onChange={onChangeAge}
              type="number"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              select
              label="Batch Number"
              variant="outlined"
              value={batchNumber}
              onChange={onChangeBatchNumber}
              disabled={loading}
            >
              {batchOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Registering..." : "Register as Buyer"}
            </Button>
          </Grid>
        </>
      ) : (
        <>
          <Stack sx={{ width: '100%' }} spacing={2}>
            {buzz ? (
              <Alert severity="error">
                {errorMessage || "Error! Please fill all the required fields with valid credentials"}
              </Alert>
            ) : ""}
          </Stack>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom>
              Vendor Registration
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Full Name"
              variant="outlined"
              value={name}
              onChange={onChangeUsername}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Email"
              variant="outlined"
              value={email}
              onChange={onChangeEmail}
              type="email"
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Contact Number"
              variant="outlined"
              value={contact}
              onChange={onChangeContact}
              inputProps={{ maxLength: 10 }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={onChangePassword}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Shop Name"
              variant="outlined"
              value={shopName}
              onChange={onChangeShopName}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Opening Time"
              variant="outlined"
              value={openTime}
              placeholder="09:00"
              onChange={onChangeOpenTime}
              disabled={loading}
              type="time"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Closing Time"
              variant="outlined"
              value={closeTime}
              placeholder="22:00"
              onChange={onChangeCloseTime}
              disabled={loading}
              type="time"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={onSubmitVendor}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Registering..." : "Register as Vendor"}
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Register;



















