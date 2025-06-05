import { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Paper from "@mui/material/Paper";

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [buzz, setBuzz] = useState(false);


    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const resetInputs = () => {
        setEmail("");
        setPassword("");
    };
    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    const onSubmit = (event) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setBuzz(true);
            resetInputs();
            return;
          }

        const newUser = {
            email: email,
            password: password
        };

        axios.post("api/user/login", newUser)
            .then((response) => {
                console.log(response.data);
                setBuzz(false);
                localStorage.setItem("status", "loggedIn");
                localStorage.setItem("user", JSON.stringify(newUser.email.toLowerCase()));
                localStorage.setItem("userType", response.data.userType);
                window.location = "/";
            })
            .catch((error) => {
                console.log(error);
                setBuzz(true);
            });

        resetInputs();
    };

    return (
        <Grid container align={"center"} spacing={2} paddingX={50}>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {buzz ? <Alert severity="error">Error! Please fill all the required (*) fields</Alert> : ""}
            </Stack>
            <Grid item xs={12}>
                <h1>Login</h1>
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
                    />
                </Grid>


                <Grid item xs={12}>
                    <Button variant="contained" onClick={onSubmit} size="large">
                        Login
                    </Button>
                </Grid>
            </Paper>
        </Grid >
    );
};

export default Login;
