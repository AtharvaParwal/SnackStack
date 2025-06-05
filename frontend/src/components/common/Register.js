import { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';



// Register as a buyer
const Register = (props) => {
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

  const [alignment, setAlignment] = useState('web');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const onChangeUsername = (event) => {
    setName(event.target.value);
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangeContact = (event) => {
    setContact(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onChangeAge = (event) => {
    setAge(event.target.value);
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
      name: name,
      email: email,
      contact: contact,
      password: password,
      age: age,
      batchNumber: batchNumber
    };

    axios
      .post("api/user/Buyerregister", newUser)
      .then((response) => {
        alert("Created Buyer\t" + response.data.name);
        console.log(response.data);
        setBuzz(false);
      })
      .catch((error) => {
        console.log(error);
        setBuzz(true);
      });

    resetInputs();
  };

  const onSubmitVendor = (event) => {
    event.preventDefault();

    const newUser = {
      name: name,
      email: email,
      contact: contact,
      password: password,
      shopName: shopName,
      openTime: openTime,
      closeTime: closeTime
    };

    axios
      .post("api/user/Vendorregister", newUser)
      .then((response) => {
        alert("Created Vendor\t" + response.data.name);
        console.log(response.data);
        setBuzz(false);
      })
      .catch((error) => {
        console.log(error);
        setBuzz(true);
      });

    resetInputs();
  };

  return (
    <Grid container align={"center"} spacing={2} paddingX={70} alignItems="center" justifyContent="center">
      <Grid item xs={12}>
        <Stack direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={4}>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="buyer" onClick={() => setFormType("buyer")}>Buyer</ToggleButton>
            <ToggleButton value="vendor" onClick={() => setFormType("vendor")}>Vendor</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

      </Grid>
      {formType == "buyer" ? <><Stack sx={{ width: '100%' }} spacing={2}> {buzz ? <Alert severity="error">Error! Please fill all the required (*) fields with valid credentials</Alert> : ""} </Stack> <Grid item xs={12}> <h1>Register as a Buyer</h1> </Grid> <Grid item xs={12}> <TextField required fullWidth label="Name" variant="outlined" value={name} onChange={onChangeUsername} /> </Grid> <Grid item xs={12}> <TextField fullWidth required label="Email" variant="outlined" value={email} onChange={onChangeEmail} /> </Grid> <Grid item xs={12}> <TextField required fullWidth label="Contact" variant="outlined" value={contact} onChange={onChangeContact} /> </Grid> <Grid item xs={12}> <TextField required fullWidth id="outlined-password-input" label="Password" type="password" autoComplete="current-password" value={password} onChange={onChangePassword} /> </Grid> <Grid item xs={12}> <TextField required fullWidth label="Age" variant="outlined" value={age} onChange={onChangeAge} /> </Grid> <Grid item xs={12}> <TextField required fullWidth label="Batch Number" variant="outlined" value={batchNumber} onChange={onChangeBatchNumber} /> </Grid> <Grid item xs={12}> <Button variant="contained" onClick={onSubmit}> Register </Button> </Grid></> : <><Stack sx={{ width: '100%' }} spacing={2}> {buzz ? <Alert severity="error">Error! Please fill all the required (*) fields with valid credentials</Alert> : ""} </Stack> <Grid item xs={12}> <h1>Register as a Vendor</h1> </Grid> <Grid item xs={12}> <TextField required fullWidth label="Name" variant="outlined" value={name} onChange={onChangeUsername} /> </Grid> <Grid item xs={12}> <TextField fullWidth required label="Email" variant="outlined" value={email} onChange={onChangeEmail} /> </Grid> <Grid item xs={12}> <TextField required fullWidth label="Contact" variant="outlined" value={contact} onChange={onChangeContact} /> </Grid> <Grid item xs={12}> <TextField required fullWidth id="outlined-password-input" label="Password" type="password" autoComplete="current-password" value={password} onChange={onChangePassword} /> </Grid> <Grid item xs={12}> <TextField required fullWidth label="Shop Name" variant="outlined" value={shopName} onChange={onChangeShopName} /> </Grid> <Grid item xs={12}> <TextField required fullWidth label="Open Time" variant="outlined" value={openTime} placeholder="24hr (HH:MM)" onChange={onChangeOpenTime} /> </Grid> <Grid item xs={12}> <TextField required fullWidth label="Close Time" variant="outlined" value={closeTime} placeholder="24hr (HH:MM)" onChange={onChangeCloseTime} /> </Grid> <Grid item xs={12}> <Button variant="contained" onClick={onSubmitVendor} > Register </Button> </Grid></>}
    </Grid>
  );

};

export default Register;



















