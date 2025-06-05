import { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Chart from 'chart.js/auto';
const statlib = require('../../middlewares/statistics');



const styles = muiBaseTheme => ({
    card: {
        maxWidth: 300,
        margin: "auto",
        transition: "0.3s",
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
        }
    },
    content: {
        textAlign: "left",
        padding: muiBaseTheme.spacing.unit * 3
    },
    divider: {
        margin: `${muiBaseTheme.spacing.unit * 3}px 0`
    },
    heading: {
        fontWeight: "bold"
    },
    subheading: {
        lineHeight: 1.8
    }
});





const Statistics = () => {

    const [orders, setOrders] = useState([]);
    const [shopName, setShopName] = useState("");

    const email = localStorage.getItem("user").replace(/"/g, "");

    useEffect(() => {
        const vendorInfo = {
            email: email
        };
        axios
            .post("api/user/findvendor", vendorInfo)
            .then(res => {

                const vendorOrders = {
                    canteen: res.data.shopName
                };
                setShopName(res.data.shopName);

                axios
                    .post("api/order/getorderbyvendor", vendorOrders)
                    .then(response => {
                        setOrders(response.data);

                        axios
                            .get("api/statistics/")
                            .then(response => {
                                const ctx = document.getElementById('myChart');
                                const myChart = new Chart(ctx, {
                                    type: 'bar',
                                    data: statlib.getCompletedOrderVsAge(response.data),
                                    options: {
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }
                                });

                                const ctx1 = document.getElementById('myChart1');
                                const myChart1 = new Chart(ctx1, {
                                    type: 'bar',
                                    data: statlib.getCompletedOrderVsBatchNumber(response.data),
                                    options: {
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch(err => {
                console.log(err);
            })

    }, [email]);

    return (
        <div>
            <Typography sx={{ textAlign: 'center', paddingBottom: 4 }} variant="h3" gutterBottom>
                Statistics
            </Typography>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={10}
            >
                <Grid item xs={12} sm={5}>
                    <Card sx={{
                        maxWidth: 500,
                        height: 300,
                        margin: "auto",
                        transition: "0.3s",
                        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                        "&:hover": {
                            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
                        }
                    }}>
                        <CardHeader title={"Top 5 items sold"} subheader={"Vendor : " + shopName} />
                        <CardContent>
                            <Stack spacing={3} direction="row" justify="center" align="center">
                                <Typography variant="h6" gutterBottom sx={{ width: '40%', flexShrink: 0 }}>
                                    Item Name
                                </Typography>
                                <Typography variant="h6" gutterBottom sx={{ width: '50%', flexShrink: 0 }}>
                                    Quantity
                                </Typography>
                            </Stack>
                            <Divider />
                            {statlib.top5items(orders).map((item, index) => {
                                return (
                                    <div>
                                        <Stack spacing={3} direction="row" justify="center" align="center">
                                            <Typography variant="h7" gutterBottom sx={{ width: '35%', flexShrink: 0 }}>
                                                {item[0]}
                                            </Typography>
                                            <Typography variant="h7" gutterBottom sx={{ width: '60%', flexShrink: 0 }}>
                                                {item[1]}
                                            </Typography>
                                        </Stack>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card sx={{
                        maxWidth: 500,
                        height: 300,
                        margin: "auto",
                        transition: "0.3s",
                        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                        "&:hover": {
                            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
                        }
                    }}>
                        <CardHeader title={"A Few Numbers"} subheader={"Vendor : " + shopName} />
                        <CardContent>
                            <Stack spacing={3} direction="row" justify="center" align="center">
                                <Typography variant="h6" gutterBottom sx={{ width: '35%', flexShrink: 0 }}>
                                    Type
                                </Typography>
                                <Typography variant="h6" gutterBottom sx={{ width: '68%', flexShrink: 0 }}>
                                    Count
                                </Typography>
                            </Stack>
                            <Divider />
                            <Stack spacing={3} direction="row" justify="center" align="center">
                                <Typography variant="h7" gutterBottom sx={{ width: '40%', flexShrink: 0 }}>
                                    Orders Placed
                                </Typography>
                                <Typography variant="h7" gutterBottom sx={{ width: '60%', flexShrink: 0 }}>
                                    {statlib.getOrdersPlaced(orders)}
                                </Typography>
                            </Stack>
                            <Stack spacing={3} direction="row" justify="center" align="center">
                                <Typography variant="h7" gutterBottom sx={{ width: '40%', flexShrink: 0 }}>
                                    Pending Orders
                                </Typography>
                                <Typography variant="h7" gutterBottom sx={{ width: '60%', flexShrink: 0 }}>
                                    {statlib.getPendingOrders(orders)}
                                </Typography>
                            </Stack>
                            <Stack spacing={3} direction="row" justify="center" align="center">
                                <Typography variant="h7" gutterBottom sx={{ width: '40%', flexShrink: 0 }}>
                                    Completed Orders
                                </Typography>
                                <Typography variant="h7" gutterBottom sx={{ width: '60%', flexShrink: 0 }}>
                                    {statlib.getCompletedOrders(orders)}
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card sx={{
                        maxWidth: 500,
                        margin: "auto",
                        transition: "0.3s",
                        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                        "&:hover": {
                            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
                        }
                    }}>
                        <CardHeader title={"Completed Orders vs Age"} subheader={"Vendor : " + shopName} />
                        <CardContent>
                            <canvas id="myChart" width="500" height="500"></canvas>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card sx={{
                        maxWidth: 500,
                        margin: "auto",
                        transition: "0.3s",
                        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                        "&:hover": {
                            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
                        }
                    }}>
                        <CardHeader title={"Completed Orders vs Batch Number"} subheader={"Vendor : " + shopName} />
                        <CardContent>
                            <canvas id="myChart1" width="500" height="500"></canvas>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </div>
    );
}

export default Statistics;