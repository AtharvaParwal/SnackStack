import { useState, useEffect, forwardRef } from "react";
import axios from "axios";
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
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, Grid, Button, Paper } from "@mui/material";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { pink, red, lightBlue } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ClearIcon from '@mui/icons-material/Clear';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { init, send } from '@emailjs/browser'
init('user_vNBAStcuIRCdghDxao5wF' );

// const statlib = require('../../middlewares/statistics');

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert icon={false} elevation={6} ref={ref} variant="filled" {...props} />;
});

const BuyerOrder = () => {

    const [orders, setOrders] = useState([]);
    const [rating, setRating] = useState([]);
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    //remove quotes from email
    const email = localStorage.getItem("user").replace(/"/g, "");

    useEffect(() => {
        const orderInfo = {
            email: email
        };
        axios
            .post("api/order/getorderbyemail", orderInfo)
            .then((response) => {
                setOrders(response.data);
                let rating_array = [];
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].status === "READY FOR PICKUP") {
                        rating_array.push(1);
                    }
                    else if (response.data[i].status === "COMPLETED" && response.data[i].rated === false) {
                        rating_array.push(2);
                    }
                    else if (response.data[i].status === "COMPLETED" && response.data[i].rated === true) {
                        rating_array.push(3);
                    }
                    else
                        rating_array.push(0);
                }
                setRating(rating_array);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const printAddons = (addons) => {
        let addonsList = [];
        addons.forEach((addon) => {
            addonsList.unshift(<Chip label={addon} color="warning" variant="outlined" sx={{ mr: 1 }} />);
        });
        return addonsList;
    };

    const completeOrder = (e, order, ind) => {
        e.preventDefault();
        const orderInfo = {
            id: order._id,
            status: "COMPLETED"
        };
        axios
            .post("api/order/updatestatus", orderInfo)
            .then((response) => {
                console.log(response);
                let rating_array = [...rating];
                rating_array[ind] = 2;
                setRating(rating_array);
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
            .post("api/food/updaterating", orderInfo)
            .then((response) => {
                console.log(response);
                let rating_array = [...rating];
                rating_array[ind] = 3;
                setRating(rating_array);
                const info = {
                    id: order._id
                }
                axios
                    .post("api/order/rated", info)
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



    return (
        <div>
            <Typography sx={{ textAlign: 'center', paddingBottom: 4 }} variant="h3" gutterBottom>
                My Orders
            </Typography>
            <Stack spacing={3} direction="row">
                <Typography sx={{ width: '9%', flexShrink: 0, ml: 2 }} variant="h5">
                    Placed At
                </Typography>
                <Typography sx={{ width: '16%', flexShrink: 0 }} variant="h5">
                    Name
                </Typography>
                <Typography sx={{ width: '5%', flexShrink: 0 }} variant="h5">
                    Vendor
                </Typography>
                <Typography sx={{ width: '7%', flexShrink: 0 }} variant="h5" >
                    Amount
                </Typography>
                <Typography sx={{ width: '7%', flexShrink: 0 }} variant="h5">
                    Quantity
                </Typography>
                <Typography sx={{ width: '16%', flexShrink: 0 }} variant="h5">
                    Rating
                </Typography>
                <Typography sx={{ width: '5%', flexShrink: 0 }} variant="h5">
                    Status
                </Typography>
            </Stack>
            {
                orders.map((order, index) => {
                    return (
                        <div>
                            <Stack key={index} direction="row" sx={{ marginTop: "2%" }} spacing={3}>
                                <ListItem divider>
                                    <Typography sx={{ width: '90%', flexShrink: 0 }}>
                                        <Stack direction="column" spacing={2}>
                                            <Stack spacing={3} direction="row">
                                                <Typography sx={{ width: '10%', flexShrink: 0 }} variant="h6">
                                                    {order.placedTime}
                                                </Typography>
                                                <Typography sx={{ width: '20%', flexShrink: 0 }} variant="h6">
                                                    {order.item}
                                                </Typography>
                                                <Typography sx={{ width: '4%', flexShrink: 0 }} variant="h6">
                                                    {order.canteen}
                                                </Typography>
                                                <Typography sx={{ width: '1%', flexShrink: 0 }}>
                                                    <CurrencyRupeeIcon fontSize="small" sx={{ paddingTop: 0.9 }} />
                                                </Typography>
                                                <Typography sx={{ width: '8%', flexShrink: 0 }} variant="h6" >
                                                    {order.cost}
                                                </Typography>
                                                <Typography sx={{ width: '5%', flexShrink: 0 }} variant="h6">
                                                    {order.quantity}
                                                </Typography>
                                                <Typography sx={{ width: '15%', flexShrink: 0 }}>
                                                    <Rating name="food-rating" value={order.rating} readOnly />
                                                </Typography>
                                                <Typography sx={{ width: '15%', flexShrink: 0 }} variant="h6">
                                                    <Alert color={rating[index] === 2 || rating[index] === 3 ? "success" : order.status === "REJECTED" ? "error" : "info"} sx={{ width: '65%', justifyContent: 'center' }}>
                                                        <Typography variant="h6">
                                                            {rating[index] === 1 ? "READY FOR PICKUP" : rating[index] === 2 ? "COMPLETED" : rating[index] === 3 ? "COMPLETED" : order.status}
                                                        </Typography>
                                                    </Alert>
                                                </Typography>
                                                <Typography sx={{ width: '5%', flexShrink: 0 }} variant="h6" hidden={rating[index] === 1 ? false : true}>
                                                    <Fab sx={{
                                                        position: 'absolute',
                                                        right: 80,
                                                        top: 20,
                                                        color: 'common.white',
                                                        bgcolor: pink[600],
                                                        '&:hover': {
                                                            bgcolor: pink[800]
                                                        }
                                                    }} aria-label={"Pickup"} variant="extended" onClick={(e) => completeOrder(e, order, index)} >
                                                        <ShoppingBagIcon sx={{ mr: 1 }} />
                                                        Picked  up?
                                                    </Fab>
                                                </Typography>
                                                <Typography sx={{ width: '15%', flexShrink: 0 }} variant="h6">
                                                    <Stack spacing={1} direction="column">
                                                        <Typography sx={{ width: '20%', flexShrink: 0 }} variant="h6" hidden={rating[index] === 2 ? false : true}>
                                                            Rate Us
                                                        </Typography>
                                                        <Typography sx={{ width: '200%', flexShrink: 0 }} variant="h6" hidden={rating[index] === 3 ? false : true}>
                                                            Thanks for rating us!
                                                        </Typography>
                                                        <Typography sx={{ width: '10%', flexShrink: 0 }} variant="h6" hidden={rating[index] === 2 ? false : true}>
                                                            <Rating
                                                                name="simple-controlled"
                                                                defaultValue={0}
                                                                onChange={(event, newValue) => {
                                                                    updateRating(event, newValue, order, index);
                                                                }}
                                                            // disabled={rating[index] === 3 ? true : false}
                                                            />
                                                        </Typography>
                                                    </Stack>
                                                </Typography>
                                            </Stack>
                                            <Stack spacing={2} direction="row">
                                                <Typography sx={{ width: '10%', flexShrink: 0 }} variant="h5">
                                                    Addons :
                                                </Typography>
                                                {printAddons(order.addons)}
                                            </Stack>
                                        </Stack>
                                    </Typography>

                                </ListItem>
                            </Stack>
                        </div>
                    );
                })
            }
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Order Rated Successfully!
                </Alert>
            </Snackbar>
        </div >
    );
}

const VendorOrder = () => {

    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState([]);
    const [open, setOpen] = useState(false);
    const [erropen, setErropen] = useState(false);
    const [count, setCount] = useState(0);

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
    //remove quotes from email
    const email = localStorage.getItem("user").replace(/"/g, "");

    useEffect(() => {
        const vendorInfo = {
            email: email
        };
        axios
            .post("api/user/findvendor", vendorInfo)
            .then(res => {
                // console.log(res.data.shopName);
                const vendorOrders = {
                    canteen: res.data.shopName
                };
                // console.log(vendorOrders);
                axios
                    .post("api/order/getorderbyvendor", vendorOrders)
                    .then(response => {
                        let status_array = [];
                        var cnt = 0;
                        for (let i = 0; i < response.data.length; i++) {
                            status_array.push(stat_index[response.data[i].status]);
                            if (stat_index[response.data[i].status] === 1 || stat_index[response.data[i].status] === 2) {
                                cnt++;
                            }
                        }
                        setCount(cnt);
                        // console.log(response.data);
                        setStatus(status_array);
                        setOrders(response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch(err => {
                console.log(err);
            })

    }, []);

    const printAddons = (addons) => {
        let addonsList = [];
        addons.forEach((addon) => {
            addonsList.unshift(<Chip label={addon} color="warning" variant="outlined" sx={{ mr: 1 }} />);
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
            .post("api/order/updatestatus", orderInfo)
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
                    }
                    ).catch(err => {
                        console.log(err);
                    });
                }
                setStatus(status_array);
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
            .post("api/order/updatestatus", orderInfo)
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
                }
                ).catch(err => {
                    console.log(err);
                });
                setStatus(status_array);
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
                    .post("api/wallet/addbalance", walletInfo)
                    .then((response) => {
                    })
                    .catch((error) => {
                        console.log(error);
                    }
                    );
            });

    };



    return (
        <div>
            <Typography sx={{ textAlign: 'center', paddingBottom: 4 }} variant="h3" gutterBottom>
                Recieved Orders
            </Typography>
            <Stack spacing={3} direction="row">
                <Typography sx={{ width: '15%', flexShrink: 0, ml: 2 }} variant="h5">
                    Placed At
                </Typography>
                <Typography sx={{ width: '20%', flexShrink: 0 }} variant="h5">
                    Name
                </Typography>
                <Typography sx={{ width: '20%', flexShrink: 0 }} variant="h5">
                    Quantity
                </Typography>
                <Typography sx={{ width: '5%', flexShrink: 0 }} variant="h5">
                    Status
                </Typography>

            </Stack>
            {
                orders.map((order, index) => {
                    return (
                        <div>
                            <Stack key={index} direction="row" sx={{ marginTop: "2%" }} spacing={3}>
                                <ListItem divider>
                                    <Typography sx={{ width: '90%', flexShrink: 0 }}>
                                        <Stack direction="column" spacing={2}>
                                            <Stack spacing={3} direction="row">
                                                <Typography sx={{ width: '17%', flexShrink: 0 }} variant="h6">
                                                    {order.placedTime}
                                                </Typography>
                                                <Typography sx={{ width: '25%', flexShrink: 0 }} variant="h6">
                                                    {order.item}
                                                </Typography>
                                                <Typography sx={{ width: '17%', flexShrink: 0 }} variant="h6">
                                                    {order.quantity}
                                                </Typography>
                                                <Typography sx={{ width: '15%', flexShrink: 0 }} variant="h6">
                                                    <Alert color={status[index] === 4 ? "success" : status[index] === 5 ? "error" : "info"} sx={{ width: '65%', justifyContent: 'center' }}>
                                                        <Typography variant="h6">
                                                            {stat_names[status[index]]}
                                                        </Typography>
                                                    </Alert>
                                                </Typography>
                                                <Typography sx={{ width: '15%', flexShrink: 0 }} variant="h6" hidden={status[index] === 3 || status[index] === 4 || status[index] === 5 ? true : false}>
                                                    <Fab sx={{
                                                        position: 'absolute',
                                                        right: 180,
                                                        top: 0,
                                                        color: 'common.white',
                                                        bgcolor: lightBlue[400],
                                                        '&:hover': {
                                                            bgcolor: lightBlue[600]
                                                        },
                                                        width: '15%',
                                                        height: '60%',
                                                        fontSize: '1rem',
                                                    }} aria-label={"Next"} variant="extended" onClick={(e) => moveToNextStage(e, order, index)} >
                                                        <NavigateNextIcon sx={{ mr: 0 }} />
                                                        Move To Next Stage
                                                    </Fab>
                                                </Typography>
                                                <Typography sx={{ width: '5%', flexShrink: 0 }} variant="h6" hidden={status[index] === 0 ? false : true}>
                                                    <Fab sx={{
                                                        position: 'absolute',
                                                        right: 80,
                                                        top: 7,
                                                        color: 'common.white',
                                                        bgcolor: red[700],
                                                        '&:hover': {
                                                            bgcolor: red[900]
                                                        }
                                                    }} aria-label={"Reject"} onClick={(e) => rejectOrder(e, order, index)} >
                                                        <ClearIcon sx={{ mr: 0 }} />
                                                    </Fab>
                                                </Typography>
                                            </Stack>
                                            <Stack spacing={2} direction="row">
                                                <Typography sx={{ width: '10%', flexShrink: 0 }} variant="h5">
                                                    Addons :
                                                </Typography>
                                                {printAddons(order.addons)}
                                            </Stack>
                                        </Stack>
                                    </Typography>

                                </ListItem>
                            </Stack>
                        </div>
                    );
                })
            }
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Order Rated Successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={erropen} autoHideDuration={3000} onClose={handleerrClose}>
                <Alert onClose={handleerrClose} severity="error" sx={{ width: '100%' }}>
                    No Space Available! Move other orders beyond cooking stage first
                </Alert>
            </Snackbar>
        </div >
    );
}


const Orders = () => {

    return (
        <div>
            {localStorage.getItem("userType") === "Buyer" ? <BuyerOrder /> : <VendorOrder />}
        </div>
    );
}

export default Orders;