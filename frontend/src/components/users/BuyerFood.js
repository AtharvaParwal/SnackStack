import { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { pink, red } from '@mui/material/colors';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import Slider from '@mui/material/Slider';
import Box from "@mui/material/Box";

import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import veg from "./vegetarian.png";
import nonveg from "./ham.png";
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import { Fab, ListItemSecondaryAction, Stack } from "@mui/material";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import ReactDOM from 'react-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Fuse from 'fuse.js';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function get_current_time() {
  var date = new Date();
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  return hour + ":" + min + ":" + sec;
}

function check_if_shop_open(open_time, close_time) {
  var open_tim_min = open_time.split(":")[1];
  var open_tim_hr = open_time.split(":")[0];
  var close_tim_min = close_time.split(":")[1];
  var close_tim_hr = close_time.split(":")[0];
  var current_time = get_current_time();
  var current_tim_min = current_time.split(":")[1];
  var current_tim_hr = current_time.split(":")[0];

  if (open_tim_hr > close_tim_hr) {
    if (current_tim_hr === close_tim_hr && current_tim_min > close_tim_min)
      return false
    else if (current_tim_hr > close_tim_hr && current_tim_hr < open_tim_hr) {
      return false
    }
    else if (current_tim_hr === close_tim_hr && current_tim_min < open_tim_min)
      return false
    else
      return true
  }

  if (current_tim_hr < open_tim_hr) {
    return false;
  } else if (current_tim_hr > close_tim_hr) {
    return false;
  } else if (current_tim_hr == open_tim_hr && current_tim_hr == close_tim_hr) {
    if (current_tim_min < open_tim_min || current_tim_min > close_tim_min) {
      return false;
    } else {
      return true;
    }
  }
  else if (current_tim_hr == open_tim_hr) {
    if (current_tim_min < open_tim_min) {
      return false;
    } else {
      return true;
    }
  }
  else if (current_tim_hr == close_tim_hr) {
    if (current_tim_min > close_tim_min) {
      return false;
    } else {
      return true;
    }
  }
  else {
    return true;
  }
}


const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BuyerFood = (props) => {
  const [user, setUser] = useState();
  const [sortedUsers, setSortedUsers] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [searchText, setSearchText] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [defaultFoodItems, setDefaultFoodItems] = useState([]);
  const [backupFoodItems, setBackupFoodItems] = useState([]);
  const [quantity_array, setQuantity_array] = useState([]);
  const [amount_array, setAmount_array] = useState([]);
  const [addon_array, setAddon_array] = useState([]);
  const [open, setOpen] = useState(false);
  const [error_bar, setError_bar] = useState(false);
  const [err_msg, setErr_msg] = useState("");
  const [vegtag, setVegtag] = useState("Both");
  const [vegnonvegCheck, setVegnonvegCheck] = useState([true, true]);
  const [numshops, setNumshops] = useState(0);
  const [shopopen, setShopopen] = useState({});
  const [shopNames, setShopNames] = useState([]);
  const [tags, setTags] = useState([]);
  const [alltags, setAlltags] = useState([]);
  const [canteens, setCanteens] = useState([]);
  const [filter, setFilter] = useState({});
  const [filter_lock, setFilter_lock] = useState(false);
  const [range, setRange] = useState([0, 0]);
  const [applyfilter, setApplyfilter] = useState(0);
  const [dial, setDial] = useState(false);
  const [max_price, setMax_price] = useState(0);


  const handleSort = (event) => {
    setSortBy(event.target.value);
  };


  const handleRange = (event) => {
    setRange(event.target.value);
  };

  const filterbyprice = () => {
    var temp = [];
    foodItems.forEach(food => {
      if (food.price >= range[0] && food.price <= range[1]) {
        temp.push(food);
      }
    });
    return temp;
  }

  const sortFoodItems = (key, items) => {
    var temp = [...items];
    if (key == 0) // Price Ascending
    {
      temp.sort((a, b) => (a.price > b.price) ? 1 : -1);
    }
    else if (key == 1) // Price Descending
    {
      temp.sort((a, b) => (a.price < b.price) ? 1 : -1);
    }
    else if (key == 2) // Rating Ascending
    {
      temp.sort((a, b) => (a.rating > b.rating) ? 1 : -1);
    }
    else if (key == 3) // Rating Descending
    {
      temp.sort((a, b) => (a.rating < b.rating) ? 1 : -1);
    }

    return temp;
  }

  // useEffect(() => {
  //   addoncheck = false;
  // }, [foodItems]);



  const handleNameSelect = (event) => {
    const {
      target: { value },
    } = event;
    setShopNames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleTagSelect = (event) => {
    const {
      target: { value },
    } = event;
    setTags(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };





  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setError_bar(false);
  };

  const email = localStorage.getItem("user").replace(/"/g, "");

  useEffect(() => {
    const userInfo = {
      email: email
    }
    axios
      .post("api/user/findbuyer", userInfo)
      .then((response) => {
        setUser(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("api/user/vendors")
      .then((response) => {
        setNumshops(response.data.length);
        let temp_dict = {};
        let temp_list = [];
        for (let i = 0; i < response.data.length; i++) {
          temp_dict[response.data[i].shopName] = check_if_shop_open(response.data[i].openTime, response.data[i].closeTime);
          temp_list.push(response.data[i].shopName);
        };

        setShopopen(temp_dict);
        setCanteens(temp_list);
        setShopNames(temp_list);
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {

        axios
          .get("api/food/fooditems")
          .then((response) => {
            setFoodItems(response.data);
            setDefaultFoodItems(response.data);
            setSearchText("");
            let tag_list = [];
            for (let i = 0; i < response.data.length; i++) {
              response.data[i].tags.forEach(tag => {
                if (!tag_list.includes(tag)) {
                  tag_list.push(tag);
                }
              });
            }

            let Max = 0;
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].price > Max) {
                Max = response.data[i].price;
              }
            }
            setMax_price(Max);
            setRange([0, Max]);

            console.log(tag_list);
            setAlltags(tag_list);
            setTags(tag_list);
            let filter_dict = {};
            for (let i = 0; i < response.data.length; i++) {
              filter_dict[response.data[i]._id] = true;
            }
            setFilter(filter_dict);
          })
          .catch((error) => {
            console.log(error);
          })
          .finally();

      });
  }, []);

  useEffect(() => {
    const len = foodItems.length;
    const new_quantity_array = [];
    const new_amount_array = [];
    const new_addon_array = [];

    for (let i = 0; i < len; i++) {
      new_quantity_array.push(0);
      new_amount_array.push(foodItems[i].price);
      new_addon_array.push([]);

    }


    setQuantity_array(new_quantity_array);
    setAmount_array(new_amount_array);
    setAddon_array(new_addon_array);
    handleclosedshops(foodItems);


    // console.log(new_amount_array);
  }, [foodItems.length]);

  useEffect(() => {
    handleclosedshops(foodItems);
  }, [shopopen]);

  useEffect(() => {

    const options = {
      keys: ['name']
    }
    const fuse = new Fuse(foodItems, options);
    if (searchText !== "") {
      let foodlist = [...foodItems, ...backupFoodItems];
      let temp = [];
      let backup_temp = [];

      const result = fuse.search(searchText);
      result.forEach(obj => {
        temp.push(obj.item);
      });
      // console.log(result);
      foodlist.forEach(food => {
        if (!temp.includes(food)) {
          backup_temp.push(food);
        }
      });
      // console.log(backup_temp);
      setFoodItems(temp);
      setBackupFoodItems(backup_temp);
    }
    else {
      setFoodItems([...foodItems, ...backupFoodItems]);
      setBackupFoodItems([]);
    }
  }, [searchText]);

  const handleclosedshops = (array) => {
    // console.log(shopopen);
    const open_foodItems = [];
    const close_foodItems = [];
    // console.log(array);
    array.forEach((item) => {
      if (shopopen[item.canteen]) {
        open_foodItems.push(item);
      } else {
        close_foodItems.push(item);
      }
    });

    let arr = open_foodItems.concat(close_foodItems);

    const len = arr.length;
    const new_quantity_array = [];
    const new_amount_array = [];
    const new_addon_array = [];

    for (let i = 0; i < len; i++) {
      new_quantity_array.push(0);
      new_amount_array.push(arr[i].price);
      new_addon_array.push([]);

    }


    setQuantity_array(new_quantity_array);
    setAmount_array(new_amount_array);
    setAddon_array(new_addon_array);
    // console.log(open_foodItems);
    // console.log(close_foodItems);
    setFoodItems(arr);
    // console.log(foodItems);

  }


  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  const setFav = (id, email) => {
    const favInfo = {
      id: id,
      email: email,
    };
    axios
      .post("api/user/addtofav", favInfo)
      .then((response) => {
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const remFav = (id, email) => {
    const favInfo = {
      id: id,
      email: email,
    };
    axios
      .post("api/user/removefromfav", favInfo)
      .then((response) => {
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSetFav = (event, email, id) => {
    event.preventDefault();
    // console.log(id);
    user.favourites.push(id);
    setUser(user);

    const userInfo = {
      email: email,
      favourites: user.favourites,
      name: user.name,
      contact: user.contact,
      batchNumber: user.batchNumber,
      age: user.age
    };
    axios
      .post("api/user/updatebuyer", userInfo)
      .then((response) => {
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRemFav = (event, email, id) => {
    event.preventDefault();
    // console.log(id);
    user.favourites.splice(user.favourites.indexOf(id), 1);
    setUser(user);


    // update user in database
    const userInfo = {
      email: email,
      favourites: user.favourites,
      name: user.name,
      contact: user.contact,
      batchNumber: user.batchNumber,
      age: user.age
    };
    axios
      .post("api/user/updatebuyer", userInfo)
      .then((response) => {
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("removed");
  };

  const handleQuantity = (event, index, quantity) => {
    event.preventDefault();
    let new_quantity_array = [...quantity_array];
    new_quantity_array[index] = new_quantity_array[index] + quantity;
    if (new_quantity_array[index] < 0) {
      new_quantity_array[index] = 0;
    }
    setQuantity_array(new_quantity_array);
  }

  const veg_nonveg = (event) => {
    // console.log(vegtag);
    // event.preventDefault();
    let temp_filter = { ...filter };
    if (vegtag === "Veg") {
      foodItems.forEach((item) => {
        if (item.veg === false) {
          temp_filter[item._id] = false;
        }
        else {
          temp_filter[item._id] = true;
        }
      });
    } else if (vegtag === "Non-Veg") {
      foodItems.forEach((item) => {
        if (item.veg === true) {
          temp_filter[item._id] = false;
        }
        else {
          console.log(item.name);
          temp_filter[item._id] = true;
        }
      });
    }
    else if (vegtag === "Both") {
      foodItems.forEach((item) => {
        temp_filter[item._id] = true;
      });
    }
    else {
      foodItems.forEach((item) => {
        temp_filter[item._id] = false;
      });
    }

    // setFoodItems(new_sorted_users);
    // setFilter(temp_filter);
    // // console.log(temp_filter);
    // foodItems.forEach((item) => {
    //   console.log({ a: item.name, b: temp_filter[item._id] });
    // });
    // console.log(temp_filter);
    return temp_filter;
  }

  useEffect(() => {
    setFilter(selectTags(selectCanteen(veg_nonveg())));
  }, [applyfilter]);

  const resetFilters = (event) => {
    event.preventDefault();
    handleclosedshops(defaultFoodItems);
    // setVegtag("Both");
    let temp_filter = { ...filter };
    defaultFoodItems.forEach((item) => {
      temp_filter[item._id] = true;
    });

    setFilter(temp_filter);
    setShopNames(canteens);
    setTags(alltags);
    setVegnonvegCheck([true, true]);
    setRange([0, max_price]);
    setFilter_lock(false);
    setVegtag("Both");
    setSortBy("");
    setSearchText("");
    setBackupFoodItems([]);
  }





  // const sortChange = () => {
  //   let usersTemp = users;
  //   const flag = sortName;
  //   usersTemp.sort((a, b) => {
  //     if (flag) {
  //       if (a.name < b.name) {
  //         return 1;
  //       }
  //       if (a.name > b.name) {
  //         return -1;
  //       }
  //       return 0;
  //     } else {
  //       if (a.name < b.name) {
  //         return -1;
  //       }
  //       if (a.name > b.name) {
  //         return 1;
  //       }
  //       return 0;
  //     }
  //   });
  //   setUsers(usersTemp);
  //   setSortName(!sortName);
  // };

  const customFunction = (event) => {
    // console.log(event.target.value);
    setSearchText(event.target.value);
  };

  const printTags = (tags) => {
    let tagsList = [];
    tags.forEach((tag) => {
      tagsList.push(<Chip label={tag} color="primary" size="small" variant="outlined" />);
    });
    return tagsList;
  };

  const onchangeAddons = (event, index, price, name) => {
    if (event.target.checked) {
      let new_amount_array = [...amount_array];
      let new_addon_array = [...addon_array];
      new_amount_array[index] = new_amount_array[index] + price;
      new_addon_array[index].push(name);
      setAmount_array(new_amount_array);
      setAddon_array(new_addon_array);
      // console.log(new_amount_array);
    }
    else {
      let new_amount_array = [...amount_array];
      let new_addon_array = [...addon_array];
      new_amount_array[index] = new_amount_array[index] - price;
      new_addon_array[index].splice(new_addon_array[index].indexOf(name), 1);
      setAmount_array(new_amount_array);
      setAddon_array(new_addon_array);
      // console.log(new_amount_array);
    }
  };

  const onChangeVeg = (event) => {
    if (event.target.checked) {
      if (vegtag == "Non-Veg") {
        setVegtag("Both");
      }
      else if (vegtag == "None") {
        setVegtag("Veg");
      }
    }
    else {
      if (vegtag == "Veg") {
        setVegtag("None");
      }
      else if (vegtag == "Both") {
        setVegtag("Non-Veg");
        // console.log("hi");
      }
    }
    let temp = [...vegnonvegCheck];
    temp[0] = event.target.checked;
    setVegnonvegCheck(temp);
  };

  const onChangeNonVeg = (event) => {
    if (event.target.checked) {
      if (vegtag == "Veg") {
        setVegtag("Both");
      }
      else if (vegtag == "None") {
        setVegtag("Non-Veg");
      }
    }
    else {
      if (vegtag == "Non-Veg") {
        setVegtag("None");
      }
      else if (vegtag == "Both") {
        setVegtag("Veg");
      }
    };

    let temp = [...vegnonvegCheck];
    temp[1] = event.target.checked;
    setVegnonvegCheck(temp);
  };

  const selectCanteen = (temp_filter) => {
    // console.log(shopNames);
    // event.preventDefault();
    foodItems.forEach((item) => {
      if (shopNames.includes(item.canteen)) {
        // console.log(item.canteen);
        // temp_filter[item._id] = true;
      }
      else {
        temp_filter[item._id] = false;
      }
    });
    return temp_filter;
  }

  const selectTags = (temp_filter) => {
    // event.preventDefault();
    foodItems.forEach((item) => {
      if (tags.some(tag => item.tags.includes(tag))) {
        // console.log(item.canteen);
        // temp_filter[item._id] = true;
      }
      else if (item.tags.length == 0) {
      }
      else {
        temp_filter[item._id] = false;
      }
    });
    console.log(temp_filter);
    return temp_filter;
  }



  const applyFilters = (event) => {
    event.preventDefault();
    handleclosedshops(sortFoodItems(sortBy, filterbyprice()));
    setApplyfilter(applyfilter + 1);
    setFilter_lock(true);

  };





  const handleBuy = (event, food, index) => {
    event.preventDefault();
    var total = 0;
    if (quantity_array[index] == 0) {
      setErr_msg("Please select quantity");
      setError_bar(true);
      return;
    }

    total = amount_array[index] * quantity_array[index];

    const walletInfo = {
      email: email
    };
    var flag = 0;
    axios
      .post("api/wallet/getbalance", walletInfo)
      .then((response) => {
        if (response.data < total) {
          setErr_msg("Insufficient balance");
          setError_bar(true);
          flag = 1;
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        if (flag == 0) {
          const orderInfo = {
            email: email,
            item: food.name,
            canteen: food.canteen,
            quantity: quantity_array[index],
            cost: total,
            rating: food.rating,
            item_id: food._id,
            addons: addon_array[index]
          };
          console.log(orderInfo);
          axios
            .post("api/order/placeorder", orderInfo)
            .then((response) => {
              console.log(response.data);
              const walletInfo = {
                email: email,
                balance: total
              };
              axios
                .post("api/wallet/subtractbalance", walletInfo)
                .then((response) => {
                  console.log(response.data);
                  document.getElementById('BalNav').innerHTML = response.data;
                  setOpen(true);
                }
                )
                .catch((error) => {
                  console.log(error);
                }
                ).finally(() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                });
            })
            .catch((error) => {
              console.log(error);
            }
            );
        }
      });
  }

  const printAddons = (addons, ind) => {
    let addonsList = [];
    addons.forEach((addon) => {
      addonsList.push(<FormControlLabel control={<Checkbox defaultChecked={false} />} className="addonscheckbox" label={addon.addon + " : Rs " + addon.price} onChange={(e) => onchangeAddons(e, ind, addon.price, addon.addon)} />);
    });
    return addonsList;
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={3} lg={3}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem text>
              <h1>Filters</h1>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={9} lg={9}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
          >
            <Grid item xs={6}>
              <h1>Food Items</h1>
            </Grid>
            <Fab onClick={() => { setDial(true) }} sx={{
              color: 'common.white',
              bgcolor: pink[400],
              '&:hover': {
                bgcolor: pink[600]
              }
            }}>
              <Favorite />
            </Fab>
            <Dialog
              open={dial}
              onClose={() => { setDial(false) }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle id="alert-dialog-title">
                {"My Favourites"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {defaultFoodItems.map((food, index) => {
                    if (user.favourites.includes(food._id)) {
                      return (
                        <Stack key={index} direction="row" sx={{ marginTop: "2%" }}>
                          <Typography sx={{ width: '5%', flexShrink: 0 }}>
                            {food.veg ? <img src={veg} /> : <img src={nonveg} />}
                          </Typography>
                          <Typography sx={{ width: '25%', flexShrink: 0 }}>
                            {food.name}
                          </Typography>
                          <Typography sx={{ width: '5%', flexShrink: 0 }}>
                            {food.canteen}
                          </Typography>
                          <Typography sx={{ width: '3%', flexShrink: 0 }}>
                            <CurrencyRupeeIcon />
                          </Typography>
                          <Typography sx={{ width: '7%', flexShrink: 0 }}>
                            {food.price}
                          </Typography>
                          <Typography sx={{ width: '15%', flexShrink: 0 }}>
                            <Rating name="food-rating" value={food.rating} readOnly />
                          </Typography>
                          <Typography sx={{ width: '35%', flexShrink: 0 }}>
                            <Stack spacing={2} direction="row">
                              {printTags(food.tags)}
                            </Stack>
                          </Typography>
                          <br />
                        </Stack>

                      );
                    }
                  })}

                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { setDial(false) }}>Close</Button>
              </DialogActions>
            </Dialog>
          </Stack>
          <List component="nav" aria-label="mailbox folders">
            <TextField
              id="standard-basic"
              label="Search"
              fullWidth={true}
              value={searchText}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={customFunction}
            />
          </List>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={3} lg={3}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  Price
                </Grid>
                <Grid item xs={11}>
                  <Slider
                    value={range}
                    onChange={handleRange}
                    valueLabelDisplay="auto"
                    disabled={filter_lock}
                    min={0}
                    max={max_price}
                  // getAriaValueText={valuetext}
                  />
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
            <ListItem divider>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sortBy}
                  label="Sort By"
                  onChange={handleSort}
                  disabled={filter_lock}
                >
                  <MenuItem value={0}>Price A-Z</MenuItem>
                  <MenuItem value={1}>Price Z-A</MenuItem>
                  <MenuItem value={2}>Rating A-Z</MenuItem>
                  <MenuItem value={3}>Rating Z-A</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <ListItem divider>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">Veg / Non Veg</FormLabel>
                {/* <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={radio_value}
                  onChange={radio_handleChange}
                >
                  <FormControlLabel value="Veg" control={<Radio />} label="Veg" />
                  <FormControlLabel value="Non-Veg" control={<Radio />} label="Non-Veg" />
                </RadioGroup> */}
                <FormGroup >
                  <FormControlLabel control={<Checkbox checked={vegnonvegCheck[0]} />} label={"Veg"} onChange={onChangeVeg} disabled={filter_lock} />
                  <FormControlLabel control={<Checkbox checked={vegnonvegCheck[1]} />} label={"Non-Veg"} onChange={onChangeNonVeg} disabled={filter_lock} />
                </FormGroup>
              </FormControl>
            </ListItem>
            <ListItem divider>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">Shop Name</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={shopNames}
                  onChange={handleNameSelect}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                  disabled={filter_lock}
                >
                  {canteens.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={shopNames.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
            <ListItem divider>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">Tags</InputLabel>
                <Select
                  labelId="tags-select-label"
                  id="tags-select"
                  multiple
                  value={tags}
                  onChange={handleTagSelect}
                  input={<OutlinedInput label="tag" />}
                  renderValue={(selected) => (<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} color="primary" size="small" variant="outlined" />
                    ))}
                  </Box>)}
                  MenuProps={MenuProps}
                  disabled={filter_lock}
                >
                  {alltags.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={tags.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
            <ListItem divider>
              <Stack spacing={2} direction="row">
                <Button variant="contained" color="primary" onClick={applyFilters} disabled={filter_lock}>
                  Apply
                </Button>
                <Button variant="outlined" color="error" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </Stack>
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12} md={9} lg={9}>
          <Paper>
            {/* <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell> Sr No.</TableCell>
                  <TableCell>
                    {" "}
                    <Button onClick={sortChange}>
                      {sortName ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                    </Button>
                    Name
                  </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Batch</TableCell>
                </TableRow>
              </TableHead>
              <TableBody> */}
            {foodItems.map((food, ind) => (
              // <TableRow key={ind}>
              //   <TableCell>{ind + 1}</TableCell>
              //   <TableCell>{food.name}</TableCell>
              //   <TableCell>{food.email}</TableCell>
              //   <TableCell>{food.contact}</TableCell>
              //   <TableCell>{food.age}</TableCell>
              //   <TableCell>{food.batchNumber}</TableCell>
              // </TableRow>

              < Accordion expanded={expanded === ('panel' + ind.toString())} onChange={handleChange('panel' + ind.toString())} disabled={
                !shopopen[food.canteen]
              } hidden={!filter[food._id]}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={"panel" + ind.toString() + "bh-content"}
                  id={"panel" + ind.toString() + "bh-header"}
                >
                  <Typography sx={{ width: '5%', flexShrink: 0 }}>
                    {food.veg ? <img src={veg} /> : <img src={nonveg} />}
                  </Typography>
                  <Typography sx={{ width: '25%', flexShrink: 0 }}>
                    {food.name}
                  </Typography>
                  <Typography sx={{ width: '5%', flexShrink: 0 }}>
                    {food.canteen}
                  </Typography>
                  <Typography sx={{ width: '3%', flexShrink: 0 }}>
                    <CurrencyRupeeIcon />
                  </Typography>
                  <Typography sx={{ width: '7%', flexShrink: 0 }}>
                    {food.price}
                  </Typography>
                  <Typography sx={{ width: '15%', flexShrink: 0 }}>
                    <Rating name="food-rating" value={food.rating} readOnly />
                  </Typography>
                  <Typography sx={{ width: '35%', flexShrink: 0 }}>
                    <Stack spacing={2} direction="row">
                      {printTags(food.tags)}
                    </Stack>
                  </Typography>
                  <Typography sx={{ width: '5%', flexShrink: 0 }}>
                    {user.favourites.includes(food._id) ? <Checkbox icon={<Favorite sx={{ color: pink[500] }} />} checkedIcon={<FavoriteBorder />} onClick={(e) => {
                      handleRemFav(e, email, food._id);
                    }} /> : <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite sx={{ color: pink[500] }} />} onClick={(e) => {
                      handleSetFav(e, email, food._id);
                    }} />}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2} direction="row">
                    <Typography sx={{ width: '80%', marginLeft: 5 }}>
                      <FormGroup id={"cb" + ind.toString()}>
                        {printAddons(food.addon, ind)}
                      </FormGroup>
                    </Typography>
                    <Typography sx={{ width: '20%', marginLeft: 5, marginTop: 5 }}>
                      <Button onClick={(e) => {
                        handleQuantity(e, ind, 1);
                      }
                      }>
                        <Add />
                      </Button>
                      {quantity_array[ind]}
                      <Button onClick={(e) => {
                        handleQuantity(e, ind, -1);
                      }}
                        disabled={!quantity_array[ind]}>
                        <Remove />
                      </Button>
                    </Typography>
                    <Typography sx={{ width: '10%', marginLeft: 5, marginTop: 5 }}>
                      <Button variant="contained" onClick={(e) => {
                        // handleAddToCart(e, food);
                        handleBuy(e, food, ind);
                      }}>
                        Buy
                      </Button>
                    </Typography>
                  </Stack>
                </AccordionDetails>

              </Accordion>
            ))}
          </Paper>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Order placed successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={error_bar} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {err_msg}
        </Alert>
      </Snackbar>
    </div >
  );
};

export default BuyerFood;
