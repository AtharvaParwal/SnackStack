import { useState, useEffect } from "react";
import axios from "axios";
import { getUserProfile, isAuthenticated } from "../../utils/auth";
import { API_ENDPOINTS } from "../../config/api";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import ListItem from "@mui/material/ListItem";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import veg from "./vegetarian.png";
import nonveg from "./ham.png";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import Fab from '@mui/material/Fab';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, Grid, Button } from "@mui/material";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { red, green } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';

const VendorFood = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [foods, setFoods] = useState([]);
    const [canteen, setCanteen] = useState("");
    const [edit, setEdit] = useState(true);
    const [dial, setDial] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [rating, setRating] = useState(0);
    const [vegi, setVegi] = useState("");
    const [addon, setAddon] = useState([]);
    const [tags, setTags] = useState([]);
    const [reload, setReload] = useState(0);
    const [addform, setAddform] = useState(false);
    const [addon_name, setAddon_name] = useState("");
    const [addon_price, setAddon_price] = useState("");
    const [tag_name, setTag_name] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState("");
    const [deleteItemName, setDeleteItemName] = useState("");


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                
                // Get user profile
                const profileResult = await getUserProfile();
                if (profileResult.success) {
                    setUser(profileResult.user);
                    setCanteen(profileResult.user.shopName);
                } else {
                    console.error("Failed to fetch user profile");
                }
                
                // Fetch food items
                const foodResponse = await axios.get(API_ENDPOINTS.FOOD_ITEMS);
                setFoods(foodResponse.data);
                
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated()) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [reload]);

    useEffect(() => {
        if (foods.length > 0 && canteen) {
            const newDial = foods.map((food) => {
                return food.canteen === canteen ? false : dial[foods.indexOf(food)] || false;
            });
            setDial(newDial);
        }
    }, [foods.length, canteen]); // Added canteen dependency and simplified logic

    const opendialog = (index) => {

        setId(foods[index]._id);
        setName(foods[index].name);
        setPrice(foods[index].price);
        setRating(foods[index].rating);
        setVegi(foods[index].veg ? "Veg" : "Non-Veg");
        setAddon(foods[index].addon);
        setAddon_name("");
        setTag_name("");
        setAddon_price("");
        setTags(foods[index].tags);


        const newDial = [...dial];
        newDial[index] = true;
        setDial(newDial);
    };

    const closedialog = (index) => {

        setId("");
        setName("");
        setPrice("");
        setRating("");
        setVegi("");
        setAddon([]);
        setTags([]);
        setAddon_name("");
        setAddon_price("");
        setTag_name("");


        const newDial = [...dial];
        newDial[index] = false;
        setDial(newDial);
    };

    const printTags = (tags) => {
        let tagsList = [];
        tags.forEach((tag) => {
            tagsList.push(<Chip label={tag} color="primary" variant="outlined" />);
        });
        return tagsList;
    };
    const printTags2 = (tags) => {
        let tagsList = [];
        tags.forEach((tag) => {
            tagsList.push(<Chip label={tag} color="primary" variant="outlined" onDelete={(e) => onDeleteTag(e, tag)} sx={{ mr: 2 }} />);
        });
        return tagsList;
    };

    const handleRadiochange = (event) => {
        setVegi(event.target.value);
    };

    const onChangeName = (event) => {
        setName(event.target.value);
    };

    const onChangePrice = (event) => {
        setPrice(event.target.value);
    };

    // Removed unused functions onChangeRating, onChangeAddon, onChangeTags

    const openAddForm = () => {

        setId("");
        setName("");
        setPrice("");
        setRating("");
        setVegi("");
        setAddon([]);
        setTags([]);
        setAddform(true);
        setAddon_name("");
        setAddon_price("");
        setTag_name("");
    };

    const onAddItem = async (e) => {
        e.preventDefault();
        
        if (!name || !price || !vegi) {
            alert("Please fill in all required fields (Name, Price, Veg/Non-Veg)");
            return;
        }
        
        try {
            // Check if we have auth token
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert("Authentication required. Please log in again.");
                return;
            }
            
            const foodInfo = {
                name: name,
                price: parseFloat(price),
                rating: 0,
                veg: vegi === "Veg",
                addon: addon,
                tags: tags,
                canteen: canteen
            };
            
            console.log("Adding food item:", foodInfo);
            const response = await axios.post(API_ENDPOINTS.ADD_FOOD_ITEM, foodInfo, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Food item added:", response.data);
            
            setAddform(false);
            setReload(reload + 1);
            
            // Clear form
            setName("");
            setPrice("");
            setVegi("");
            setAddon([]);
            setTags([]);
            
        } catch (error) {
            console.error("Error adding food item:", error);
            alert("Error: " + (error.response?.data?.error || "Failed to add food item. Please check your details."));
            setAddform(false);
        }
    };




    const closeAddForm = () => {
        setAddform(false);
        setId("");
        setName("");
        setPrice("");
        setRating("");
        setVegi("");
        setAddon([]);
        setTags([]);
        setAddon_name("");
        setAddon_price("");
        setTag_name("");
    };

    const printAddons = (addons) => {
        let addonsList = [];
        addons.forEach((addon) => {
            addonsList.unshift(<Chip label={addon.addon + " : Rs " + addon.price} color="warning" sx={{ mr: 2 }} onDelete={(e) => onDeleteAddon(e, addon)} />);
        });
        return addonsList;
    };

    const printAddons2 = (addons) => {
        let addonsList = [];
        addons.forEach((addon) => {
            addonsList.unshift(<Chip label={addon.addon + " : Rs " + addon.price} color="warning" variant="outlined" sx={{ mr: 1 }} />);
        });
        return addonsList;
    };



    const onSaveVendor = async (e) => {
        e.preventDefault();
        
        if (!name || !price || !vegi) {
            alert("Please fill in all required fields (Name, Price, Veg/Non-Veg)");
            return;
        }
        
        try {
            // Check if we have auth token
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert("Authentication required. Please log in again.");
                return;
            }
            
            const data = {
                _id: id,
                name: name,
                price: parseFloat(price),
                rating: rating,
                veg: vegi === "Veg" ? true : false,
                addon: addon,
                tags: tags,
                canteen: canteen
            };
            
            console.log("Updating food item:", data);
            const response = await axios.post(API_ENDPOINTS.UPDATE_FOOD_ITEM, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Food item updated:", response.data);
            
            setReload(reload + 1);
            
        } catch (error) {
            console.error("Error updating food item:", error);
            alert("Error: " + (error.response?.data?.error || "Failed to update food item."));
        }
    };

    const onDelete = (e, ID, itemName) => {
        e.preventDefault();
        setDeleteItemId(ID);
        setDeleteItemName(itemName);
        setDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            // Check if we have auth token
            const token = localStorage.getItem('authToken');
            const userType = localStorage.getItem('userType');
            
            console.log("Auth token exists:", !!token);
            console.log("User type:", userType);
            
            if (!token) {
                alert("Authentication required. Please log in again.");
                return;
            }
            
            const data = {
                _id: deleteItemId
            };
            
            console.log("Deleting food item with ID:", deleteItemId);
            console.log("Delete endpoint:", API_ENDPOINTS.DELETE_FOOD_ITEM);
            console.log("Request payload:", data);
            
            // Make the request
            const response = await axios.post(API_ENDPOINTS.DELETE_FOOD_ITEM, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("Delete successful, response:", response.data);
            alert("Food item deleted successfully!");
            
            setDeleteConfirm(false);
            setDeleteItemId("");
            setDeleteItemName("");
            setReload(reload + 1);
            
        } catch (error) {
            console.error("Full error object:", error);
            console.error("Error message:", error.message);
            console.error("Error response:", error.response);
            console.error("Error response data:", error.response?.data);
            console.error("Error response status:", error.response?.status);
            console.error("Error response headers:", error.response?.headers);
            
            let errorMessage = "Error deleting item. Please try again.";
            
            if (error.response) {
                const status = error.response.status;
                const errorData = error.response.data;
                
                console.log(`HTTP Status: ${status}`);
                console.log(`Error Data:`, errorData);
                
                if (status === 401) {
                    errorMessage = "Authentication failed. Please log in again.";
                } else if (status === 403) {
                    errorMessage = "Access denied. Only vendors can delete items.";
                } else if (status === 404) {
                    errorMessage = "Food item not found.";
                } else if (errorData?.error) {
                    errorMessage = errorData.error;
                } else {
                    errorMessage = `Server error: ${status}`;
                }
            } else if (error.request) {
                console.error("No response received:", error.request);
                errorMessage = "Network error. Please check your connection.";
            } else {
                console.error("Error setting up request:", error.message);
                errorMessage = "Request setup error: " + error.message;
            }
            
            alert(errorMessage);
            setDeleteConfirm(false);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(false);
        setDeleteItemId("");
        setDeleteItemName("");
    };

    const onAddAddon = (e, name, price) => {
        e.preventDefault();
        
        if (!name || !price || parseFloat(price) <= 0) {
            alert("Please enter valid addon name and price");
            return;
        }
        
        let newAddon = [...addon];
        newAddon.push({ addon: name, price: parseFloat(price) });
        setAddon(newAddon);
        setAddon_name("");
        setAddon_price("");
    };

    const onAddTag = (e, tag) => {
        e.preventDefault();
        
        if (!tag || tag.trim() === "") {
            alert("Please enter a valid tag");
            return;
        }
        
        // Check if tag already exists
        if (tags.includes(tag.trim())) {
            alert("This tag already exists");
            return;
        }
        
        let newTags = [...tags];
        newTags.push(tag.trim());
        setTags(newTags);
        setTag_name("");
    };

    const onDeleteAddon = (e, Addon) => {
        e.preventDefault();
        let newAddon = [...addon];
        newAddon.splice(addon.indexOf(Addon), 1);
        setAddon(newAddon);
    };

    const onDeleteTag = (e, Tag) => {
        e.preventDefault();
        let newTags = [...tags];
        newTags.splice(tags.indexOf(Tag), 1);
        setTags(newTags);
    };




    return (
        <div>
            {loading ? (
                <Typography sx={{ textAlign: 'center' }} variant="h4" gutterBottom>
                    Loading...
                </Typography>
            ) : !user ? (
                <Typography sx={{ textAlign: 'center' }} variant="h4" gutterBottom>
                    Please log in to access this page.
                </Typography>
            ) : (
                <>
                    <Typography sx={{ textAlign: 'center' }} variant="h3" gutterBottom>
                        Food Items
                    </Typography>
            {foods.filter(food => food.canteen === canteen).map((food, index) => (
                        <div>
                            <Stack key={index} direction="row" sx={{ marginTop: "2%" }} spacing={3}>
                                <ListItem divider>

                                    <Typography sx={{ width: '90%', flexShrink: 0 }}>
                                        <Stack direction="column" spacing={2}>
                                            <Stack spacing={3} direction="row">
                                                <Typography sx={{ width: '5%', flexShrink: 0 }}>
                                                    {food.veg ? <img src={veg} alt="Vegetarian" /> : <img src={nonveg} alt="Non-Vegetarian" />}
                                                </Typography>
                                                <Typography sx={{ width: '20%', flexShrink: 0 }} variant="h6">
                                                    {food.name}
                                                </Typography>
                                                <Typography sx={{ width: '5%', flexShrink: 0 }} variant="h6">
                                                    {food.canteen}
                                                </Typography>
                                                <Typography sx={{ width: '2%', flexShrink: 0 }}>
                                                    <CurrencyRupeeIcon fontSize="small" />
                                                </Typography>
                                                <Typography sx={{ width: '8%', flexShrink: 0 }} variant="h6" >
                                                    {food.price}
                                                </Typography>
                                                <Typography sx={{ width: '15%', flexShrink: 0 }}>
                                                    <Rating name="food-rating" value={food.rating} readOnly />
                                                </Typography>
                                                {printTags(food.tags)}
                                            </Stack>
                                            <Stack spacing={2} direction="row">
                                                {printAddons2(food.addon)}
                                            </Stack>
                                        </Stack>
                                    </Typography>
                                    <Typography sx={{ width: '5%', flexShrink: 0 }}>
                                        <Fab color="primary" aria-label="edit" onClick={() => { setEdit(false); opendialog(index); }}> <EditIcon /> </Fab>
                                    </Typography>
                                    <Typography sx={{ width: '5%', flexShrink: 0 }}>
                                        <Fab aria-label="del" sx={{
                                            color: 'common.white',
                                            bgcolor: red[400],
                                            '&:hover': {
                                                bgcolor: red[600]
                                            }
                                        }} onClick={(e) => onDelete(e, food._id, food.name)} > <DeleteOutlineIcon /> </Fab>
                                    </Typography>

                                </ListItem>
                                <br />
                                <Dialog
                                    open={dial[index]}
                                    onClose={() => { closedialog(index) }}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    fullWidth={true}
                                    maxWidth="md"
                                >
                                    <DialogTitle id={"alert-dialog-title" + index.toString()}>
                                        {"Edit Food Item"}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id={"alert-dialog-description" + index.toString()}>
                                            <Box sx={{ display: "flex", alignItems: "Center", flexDirection: "column", width: '100%', paddingTop: '2rem', paddingBottom: '3rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                                                <Typography variant="h5"> Details: </Typography>
                                                <Box sx={{ width: '60%', alignItems: "Center", paddingTop: '3rem' }}>
                                                    <Stack spacing={2}>
                                                        <TextField fullWidth disabled={edit} label="Name" value={name} variant="standard" onChange={onChangeName} />
                                                        <TextField fullWidth disabled={edit} label="Price" value={price} variant="standard" onChange={onChangePrice} />
                                                        <FormControl>
                                                            <FormLabel id="demo-controlled-radio-buttons-group">Veg / Non-Veg</FormLabel>
                                                            <RadioGroup
                                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                                name="controlled-radio-buttons-group"
                                                                value={vegi}
                                                                onChange={handleRadiochange}
                                                            >
                                                                <FormControlLabel value="Veg" control={<Radio />} label="Veg" />
                                                                <FormControlLabel value="Non-Veg" control={<Radio />} label="Non-Veg" />
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <ListItem>
                                                            {printAddons(addon)}
                                                        </ListItem>
                                                        <Stack spacing={2} direction="row">
                                                            <TextField disabled={edit} label="Addon" value={addon_name} variant="standard" onChange={(e) => setAddon_name(e.target.value)} />
                                                            <TextField disabled={edit} label="Price" value={addon_price} variant="standard" onChange={(e) => setAddon_price(e.target.value)} />
                                                            <Fab size="small" color="primary" onClick={(e) => onAddAddon(e, addon_name, addon_price)}>
                                                                <AddIcon fontSize="small" />
                                                            </Fab>
                                                        </Stack>
                                                        <ListItem>
                                                            {printTags2(tags)}
                                                        </ListItem>
                                                        <Stack spacing={2} direction="row">
                                                            <TextField disabled={edit} label="Tag" value={tag_name} variant="standard" onChange={(e) => setTag_name(e.target.value)} />
                                                            <Fab size="small" color="primary" onClick={(e) => onAddTag(e, tag_name)}>
                                                                <AddIcon fontSize="small" />
                                                            </Fab>
                                                        </Stack>
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={(event) => { onSaveVendor(event); closedialog(index); setEdit(false) }} color="primary">
                                            Save
                                        </Button>
                                        <Button onClick={() => { closedialog(index); setEdit(false) }} color="primary" autoFocus>
                                            Cancel
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                            </Stack>
                        </div>
                    ))}
            <Fab sx={{
                position: 'sticky',
                bottom: 16,
                left: "90%",
                color: 'common.white',
                bgcolor: green[600],
                '&:hover': {
                    bgcolor: green[800]
                }
            }} aria-label={"Add"} variant="extended" onClick={() => { openAddForm() }}>
                <AddIcon sx={{ mr: 1 }} />
                Add Items
            </Fab>
            <Dialog
                open={addform}
                onClose={() => { closeAddForm() }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle id={"alert-dialog-title"}>
                    {"Add Food Item"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id={"alert-add"}>
                        <Box sx={{ display: "flex", alignItems: "Center", flexDirection: "column", width: '100%', paddingTop: '2rem', paddingBottom: '3rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                            <Typography variant="h5"> Details: </Typography>
                            <Box sx={{ width: '60%', alignItems: "Center", paddingTop: '3rem' }}>
                                <Stack spacing={2}>
                                    <TextField fullWidth label="Name" value={name} variant="standard" onChange={onChangeName} />
                                    <TextField fullWidth label="Price" value={price} variant="standard" onChange={onChangePrice} />
                                    <FormControl>
                                        <FormLabel id="demo-controlled-radio-buttons-group">Veg / Non-Veg</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            value={vegi}
                                            onChange={handleRadiochange}
                                        >
                                            <FormControlLabel value="Veg" control={<Radio />} label="Veg" />
                                            <FormControlLabel value="Non-Veg" control={<Radio />} label="Non-Veg" />
                                        </RadioGroup>
                                    </FormControl>
                                    <ListItem>
                                        {printAddons(addon)}
                                    </ListItem>
                                    <Stack spacing={2} direction="row">
                                        <TextField label="Addon" value={addon_name} variant="standard" onChange={(e) => setAddon_name(e.target.value)} />
                                        <TextField label="Price" value={addon_price} variant="standard" onChange={(e) => setAddon_price(e.target.value)} />
                                        <Fab size="small" color="primary" onClick={(e) => onAddAddon(e, addon_name, addon_price)}>
                                            <AddIcon fontSize="small" />
                                        </Fab>
                                    </Stack>
                                    <ListItem>
                                        {printTags2(tags)}
                                    </ListItem>
                                    <Stack spacing={2} direction="row">
                                        <TextField label="Tag" value={tag_name} variant="standard" onChange={(e) => setTag_name(e.target.value)} />
                                        <Fab size="small" color="primary" onClick={(e) => onAddTag(e, tag_name)}>
                                            <AddIcon fontSize="small" />
                                        </Fab>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={(event) => { onAddItem(event); closeAddForm(); }} color="primary">
                        Save
                    </Button>
                    <Button onClick={() => { closeAddForm(); }} color="primary" autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirm}
                onClose={cancelDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title" sx={{ color: red[600] }}>
                    ⚠️ Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete <strong>"{deleteItemName}"</strong>?
                        <br /><br />
                        This action cannot be undone and will permanently remove this food item from your menu.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={cancelDelete} 
                        color="primary" 
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmDelete} 
                        sx={{
                            bgcolor: red[400],
                            color: 'white',
                            '&:hover': {
                                bgcolor: red[600]
                            }
                        }}
                        variant="contained"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
                </>
            )}
        </div>);
}

export default VendorFood;