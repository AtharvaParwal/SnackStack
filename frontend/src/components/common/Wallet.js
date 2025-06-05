import { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ReactDOM from 'react-dom';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Wallet = (props) => {
    const email = localStorage.getItem("user").replace(/"/g, "");
    const [balance, setBalance] = useState("");
    const [value, setValue] = useState("");
    const [buzz, setBuzz] = useState(false);
    const [open, setOpen] = useState(false);


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        const walletInfo = {
            email: email
        };
        axios
            .post("api/wallet/getbalance", walletInfo)
            .then((response) => {
                setBalance(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const onChangeValue = (e) => {
        setValue(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const walletInfo = {
            email: email,
            balance: Math.floor(value)
        };
        axios
            .post("api/wallet/addbalance", walletInfo)
            .then((response) => {
                setBalance(response.data);
                console.log(response.data);
                setBuzz(false);
                ReactDOM.render(response.data, document.getElementById('BalNav'));
                setOpen(true);
            })
            .catch((error) => {
                console.log(error);
                setBuzz(true);
            });

        setValue("");
    };

    return (
        <Grid container align={"center"} spacing={2} paddingX={50}>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {buzz ? <Alert severity="error">Error! Please fill all the required (*) fields</Alert> : ""}
            </Stack>
            <Grid item xs={12}>
                <h1>Add Money</h1>
            </Grid>

            <Paper elevation={8} sx={{ width: 600, paddingTop: 7, paddingBottom: 5, paddingLeft: 15, paddingRight: 15, borderRadius: 2, lineHeight: 5 }}>
                <Grid item xs={12}>
                    <h3>Current Balance:</h3>
                    <Typography variant="h2" gutterBottom mb={10}>{balance}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        label="Amount"
                        variant="outlined"
                        value={value}
                        onChange={onChangeValue}
                        placeholder="Enter amount in Rupees (integer)"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={onSubmit} size="large">
                        Add
                    </Button>
                </Grid>
            </Paper>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Amount added to your wallet successfully!
                </Alert>
            </Snackbar>
        </Grid >
    );
};

export default Wallet;

