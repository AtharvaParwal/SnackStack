import { useState, useEffect, forwardRef } from "react";
import { getUserProfile, updateProfile, isAuthenticated } from '../../utils/auth';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Fab from '@mui/material/Fab';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [age, setAge] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [shopName, setShopName] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [edit, setEdit] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [favouriteItems, setFavouriteItems] = useState([]);
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");

  const batchOptions = ["UG1", "UG2", "UG3", "UG4", "UG5"];

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    console.log("Profile component mounted");
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setErrorMessage("Please login first.");
      window.location.href = '/login';
      return;
    }

    // Get user type from localStorage
    const storedUserType = localStorage.getItem("userType");
    const storedUserId = localStorage.getItem("userId");
    setUserType(storedUserType);
    setUserId(storedUserId);

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        console.log("Fetching user profile...");
        const result = await getUserProfile();
        
        if (result.success) {
          console.log("Profile data received:", result.user);
          const userData = result.user;
          
          setName(userData.name);
          setEmail(userData.email);
          setContact(userData.contact);
          
          if (userData.userType === 'Buyer') {
            setAge(userData.age);
            setBatchNumber(userData.batchNumber);
            setFavourites(userData.favourites || []);
            
            // Fetch favourite food items details
            if (userData.favourites && userData.favourites.length > 0) {
              fetchFavouriteItems(userData.favourites);
            }
          } else if (userData.userType === 'Vendor') {
            setShopName(userData.shopName);
            setOpenTime(userData.openTime);
            setCloseTime(userData.closeTime);
          }
          
          setErrorMessage(""); // Clear any previous errors
        } else {
          console.error("Failed to fetch profile:", result.error);
          setErrorMessage(result.error);
        }
      } catch (error) {
        console.error("Unexpected error fetching profile:", error);
        setErrorMessage("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const fetchFavouriteItems = async (favouriteIds) => {
    try {
      console.log("Fetching favourite items for IDs:", favouriteIds);
      const response = await axios.get(API_ENDPOINTS.FOOD_ITEMS);
      const allItems = response.data;
      const favItems = allItems.filter(item => favouriteIds.includes(item._id));
      console.log("Favourite items found:", favItems);
      setFavouriteItems(favItems);
    } catch (error) {
      console.error("Error fetching favourite items:", error);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      setErrorMessage("Name is required");
      return false;
    }
    if (!contact || contact.length !== 10) {
      setErrorMessage("Contact must be 10 digits");
      return false;
    }
    if (userType === "Buyer" && (!age || age < 16)) {
      setErrorMessage("Age must be at least 16");
      return false;
    }
    if (userType === "Vendor" && (!openTime || !closeTime)) {
      setErrorMessage("Shop timings are required");
      return false;
    }
    return true;
  };

  const onSaveBuyer = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        name: name.trim(),
        contact: contact,
        age: Number(age),
        batchNumber: batchNumber,
        favourites: favourites
      };

      console.log("Updating buyer profile:", profileData);
      const result = await updateProfile(profileData);
      
      if (result.success) {
        console.log("Profile updated successfully:", result.user);
        setEdit(true);
        setOpen(true);
        setErrorMessage("");
      } else {
        console.error("Profile update failed:", result.error);
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error("Unexpected error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSaveVendor = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        name: name.trim(),
        contact: contact,
        shopName: shopName.trim(),
        openTime: openTime,
        closeTime: closeTime
      };

      console.log("Updating vendor profile:", profileData);
      const result = await updateProfile(profileData);
      
      if (result.success) {
        console.log("Profile updated successfully:", result.user);
        setEdit(true);
        setOpen(true);
        setErrorMessage("");
      } else {
        console.error("Profile update failed:", result.error);
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error("Unexpected error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onChangeContact = (event) => {
    const value = event.target.value;
    if (value === "" || (/^\d+$/.test(value) && value.length <= 10)) {
      setContact(value);
    }
  };

  const onChangeAge = (event) => {
    const value = event.target.value;
    if (value === "" || (Number(value) > 0 && Number(value) <= 120)) {
      setAge(value);
    }
  };

  const renderBuyerProfile = () => (
    <>
      <Grid item xs={12} md={6}>
        <Paper elevation={8} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center">
            Profile Details
          </Typography>
          
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                disabled={edit}
                fullWidth
                label="Name"
                value={name}
                variant="outlined"
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled
                fullWidth
                label="Email"
                value={email}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled={edit}
                fullWidth
                label="Contact"
                value={contact}
                variant="outlined"
                onChange={onChangeContact}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled={edit}
                fullWidth
                label="Age"
                value={age}
                variant="outlined"
                onChange={onChangeAge}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={edit}
                fullWidth
                select
                label="Batch Number"
                value={batchNumber}
                variant="outlined"
                onChange={(e) => setBatchNumber(e.target.value)}
              >
                {batchOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Fab
                disabled={edit || loading}
                color="primary"
                aria-label="save"
                onClick={onSaveBuyer}
                sx={{ mr: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : <SaveIcon />}
              </Fab>
              <Fab
                color="secondary"
                aria-label="edit"
                onClick={() => setEdit(false)}
                disabled={!edit}
              >
                <EditIcon />
              </Fab>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card elevation={8}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Favourite Items ({favouriteItems.length})
            </Typography>
            {favouriteItems.length > 0 ? (
              <Grid container spacing={2}>
                {favouriteItems.map((item) => (
                  <Grid item xs={12} key={item._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.canteen} • ₹{item.price}
                        </Typography>
                        <Chip 
                          label={item.veg ? "Veg" : "Non-Veg"} 
                          color={item.veg ? "success" : "error"} 
                          size="small" 
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                      <Typography variant="body2" color="primary">
                        ★ {item.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No favourite items yet. Start exploring food items!
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </>
  );

  const renderVendorProfile = () => (
    <Grid item xs={12} md={8} mx="auto">
      <Paper elevation={8} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Vendor Profile
        </Typography>
        
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              disabled={edit}
              fullWidth
              label="Name"
              value={name}
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled
              fullWidth
              label="Email"
              value={email}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              disabled={edit}
              fullWidth
              label="Contact"
              value={contact}
              variant="outlined"
              onChange={onChangeContact}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              disabled={edit}
              fullWidth
              label="Shop Name"
              value={shopName}
              variant="outlined"
              onChange={(e) => setShopName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              disabled={edit}
              fullWidth
              label="Opening Time"
              value={openTime}
              variant="outlined"
              onChange={(e) => setOpenTime(e.target.value)}
              type="time"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              disabled={edit}
              fullWidth
              label="Closing Time"
              value={closeTime}
              variant="outlined"
              onChange={(e) => setCloseTime(e.target.value)}
              type="time"
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Fab
              disabled={edit || loading}
              color="primary"
              aria-label="save"
              onClick={onSaveVendor}
              sx={{ mr: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : <SaveIcon />}
            </Fab>
            <Fab
              color="secondary"
              aria-label="edit"
              onClick={() => setEdit(false)}
              disabled={!edit}
            >
              <EditIcon />
            </Fab>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h3" gutterBottom align="center">
        Hello, {name || "User"}! 👋
      </Typography>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}
      
      {errorMessage && !loading && (
        <Grid container justifyContent="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          </Grid>
        </Grid>
      )}
      
      {!loading && !errorMessage && (
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {userType === "Buyer" ? renderBuyerProfile() : renderVendorProfile()}
        </Grid>
      )}

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;

