import axios from "axios";
import { useState, useEffect, forwardRef } from "react";
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


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  useEffect(() => {

    const email = localStorage.getItem("user").replace(/"/g, "");
    const data = {
      email: email
    }
    if (localStorage.getItem("userType") === "Buyer") {
      axios.post("api/user/findbuyer", data)
        .then((res) => {
          setName(res.data.name);
          setEmail(res.data.email);
          setContact(res.data.contact);
          setAge(res.data.age);
          setBatchNumber(res.data.batchNumber);
          setFavourites(res.data.favourites);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else if (localStorage.getItem("userType") === "Vendor") {
      axios.post("api/user/findvendor", data)
        .then((res) => {
          setName(res.data.name);
          setEmail(res.data.email);
          setContact(res.data.contact);
          setShopName(res.data.shopName);
          setOpenTime(res.data.openTime);
          setCloseTime(res.data.closeTime);
        })
        .catch((err) => {
          console.log(err);
        });
    }

  }, []);


  const onChangeName = (event) => {
    setName(event.target.value);
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangeContact = (event) => {
    setContact(event.target.value);
  };

  const onChangeAge = (event) => {
    setAge(event.target.value);
  };

  const onChangeBatchNumber = (event) => {
    setBatchNumber(event.target.value);
  };

  const onChangeFavourites = (event) => {
    setFavourites(event.target.value);
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



  const onSaveBuyer = (event) => {
    event.preventDefault();

    const newBuyer = {
      name: name,
      email: email,
      contact: contact,
      age: age,
      batchNumber: batchNumber,
      favourites: favourites
    }

    axios.post("api/user/updatebuyer", newBuyer)
      .then((res) => {
        console.log(res);
        setEdit(true);
        setOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSaveVendor = (event) => {
    event.preventDefault();

    const newVendor = {
      name: name,
      email: email,
      contact: contact,
      shopName: shopName,
      openTime: openTime,
      closeTime: closeTime
    }

    axios.post("api/user/updatevendor", newVendor)
      .then((res) => {
        console.log(res);
        setEdit(true);
        setOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };




  return (
    <Grid container spacing={2} paddingX={50}>
      {localStorage.getItem("userType") === "Buyer" ? <><Grid item xs={12} paddingBottom={2}> <Typography variant="h3"> Hello, {name} </Typography> </Grid> <Grid item xs={12}> </Grid> <Paper elevation={8} align={"center"} sx={{ width: 400, paddingTop: 7, paddingBottom: 5, paddingLeft: 15, paddingRight: 15, borderRadius: 2, lineHeight: 5 }}> <Grid item xs={12}> <Typography variant="h4"> Your Details: </Typography> </Grid> <Grid item xs={12} paddingTop={5}> <TextField disabled={edit} label="Name" value={name} variant="standard" onChange={onChangeName} /> </Grid> <Grid item xs={12} > <TextField disabled label="Email" value={email} variant="standard" onChange={onChangeEmail} /> </Grid> <Grid item xs={12}> <TextField disabled={edit} label="Contact" value={contact} variant="standard" onChange={onChangeContact} /> </Grid> <Grid item xs={12}> <TextField disabled={edit} label="Age" value={age} variant="standard" onChange={onChangeAge} /> </Grid> <Grid item xs={12}> <TextField disabled={edit} label="Batch Number" value={batchNumber} variant="standard" onChange={onChangeBatchNumber} /> </Grid> <Grid item xs={12} sx={{ '& > :not(style)': { m: 2 } }}> <Fab disabled={edit} color="primary" aria-label="save" onClick={onSaveBuyer}> <SaveIcon /> </Fab> <Fab color="primary" aria-label="edit" onClick={() => setEdit(false)}> <EditIcon /> </Fab> </Grid> </Paper ></> : <><Grid item xs={12} paddingBottom={2}> <Typography variant="h3"> Hello, {name} </Typography> </Grid> <Grid item xs={12}> </Grid> <Paper elevation={8} align={"center"} sx={{ width: 400, paddingTop: 7, paddingBottom: 5, paddingLeft: 15, paddingRight: 15, borderRadius: 2, lineHeight: 5 }}> <Grid item xs={12}> <Typography variant="h4"> Your Details: </Typography> </Grid> <Grid item xs={12} paddingTop={5}> <TextField disabled={edit} label="Name" value={name} variant="standard" onChange={onChangeName} /> </Grid> <Grid item xs={12} > <TextField disabled label="Email" value={email} variant="standard" onChange={onChangeEmail} /> </Grid> <Grid item xs={12}> <TextField disabled={edit} label="Contact" value={contact} variant="standard" onChange={onChangeContact} /> </Grid> <Grid item xs={12}> <TextField disabled={edit} label="Shop Name" value={shopName} variant="standard" onChange={onChangeShopName} /> </Grid> <Grid item xs={12}> <TextField disabled={edit} label="Open Time" value={openTime} variant="standard" onChange={onChangeOpenTime} /> </Grid> <Grid item xs={12}> <TextField disabled={edit} label="Close Time" value={closeTime} variant="standard" onChange={onChangeCloseTime} /> </Grid> <Grid item xs={12} sx={{ '& > :not(style)': { m: 2 } }}> <Fab disabled={edit} color="primary" aria-label="save" onClick={onSaveVendor}> <SaveIcon /> </Fab> <Fab color="primary" aria-label="edit" onClick={() => setEdit(false)}> <EditIcon /> </Fab> </Grid> </Paper ></>}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Changes saved successfully!
        </Alert>
      </Snackbar>
    </Grid >);
};

export default Profile;

