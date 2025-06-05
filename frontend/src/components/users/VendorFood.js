import { useState, useEffect } from "react";
import axios from "axios";
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
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, Grid, Button, Paper } from "@mui/material";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { pink, red, green } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';

const VendorFood = () => {

    const email = localStorage.getItem("user").replace(/"/g, "");
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


    useEffect(() => {
        const foodInfo = {
            email: email
        };
        axios
            .post("api/user/findvendor", foodInfo)
            .then((response) => {
                setCanteen(response.data.shopName);
            })
            .catch((error) => {
                console.log(error);
            });

        axios
            .get("api/food/fooditems")
            .then((response) => {
                setFoods(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [reload]);

    useEffect(() => {
        foods.forEach((food) => {
            if (food.shopName === canteen) {
                setDial(dial.concat([false]));
            }
        });
    }, [foods.length]);

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

    const onChangeRating = (event) => {
        setRating(event.target.value);
    };


    const onChangeAddon = (event) => {
        setAddon(event.target.value);
    };

    const onChangeTags = (event) => {
        setTags(event.target.value);
    };

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

    const onAddItem = (e) => {
        e.preventDefault();
        const foodInfo = {
            name: name,
            price: price,
            rating: 0,
            veg: vegi === "Veg",
            addon: addon,
            tags: tags,
            canteen: canteen
        };
        console.log(foodInfo);
        axios
            .post("api/food/addfooditems", foodInfo)
            .then((response) => {
                setAddform(false);
                setReload(reload + 1);

            })
            .catch((error) => {
                console.log(error);
                alert("Error: Enter Valid Details");
                setAddform(false);
            });
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
        setAddform(true);
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



    const onSaveVendor = (e) => {
        e.preventDefault();
        const data = {
            _id: id,
            name: name,
            price: price,
            rating: rating,
            veg: vegi === "Veg" ? true : false,
            addon: addon,
            tags: tags,
            canteen: canteen
        };
        console.log(data);
        axios
            .post("api/food/updatefooditem", data)
            .then((response) => {
                console.log(response);
                setReload(reload + 1);
            }
            )
            .catch((error) => {
                console.log(error);
            }
            );
    }

    const onDelete = (e, ID) => {
        e.preventDefault();
        const data = {
            _id: ID
        };
        axios
            .post("api/food/deletefooditem", data)
            .then((response) => {
                console.log(response);
                setReload(reload + 1);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const onAddAddon = (e, name, price) => {
        e.preventDefault();
        let newAddon = [...addon];
        newAddon.push({ addon: name, price: price });
        setAddon(newAddon);
        setAddon_name("");
        setAddon_price("");
    };

    const onAddTag = (e, tag) => {
        e.preventDefault();
        let newTags = [...tags];
        newTags.push(tag);
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
            <Typography sx={{ textAlign: 'center' }} variant="h3" gutterBottom>
                Food Items
            </Typography>
            {foods.map((food, index) => {
                if (food.canteen === canteen) {
                    return (
                        <div>
                            <Stack key={index} direction="row" sx={{ marginTop: "2%" }} spacing={3}>
                                <ListItem divider>

                                    <Typography sx={{ width: '90%', flexShrink: 0 }}>
                                        <Stack direction="column" spacing={2}>
                                            <Stack spacing={3} direction="row">
                                                <Typography sx={{ width: '5%', flexShrink: 0 }}>
                                                    {food.veg ? <img src={veg} /> : <img src={nonveg} />}
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
                                        }} onClick={(e) => onDelete(e, food._id)} > <DeleteOutlineIcon /> </Fab>
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
                    );
                }
            })
            }
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
        </div >);
}

export default VendorFood;