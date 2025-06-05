import { Stack, Grid, Typography } from "@mui/material";

const Home = (props) => {


  return (<div>
    <Grid container component="main" sx={{ height: '100vh' }} direction="column" justify="center" alignItems="center">
      <Grid item xs={false}
        sm={12}
        md={12}>
        <Typography variant="h2" component="h1" sx={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '6rem',
        }}>
          Welcome!
          <Typography variant="h5" component="h2" sx={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: '2rem',
            paddingTop: '2rem',
          }}>
            {localStorage.getItem("status") == "loggedIn" ? localStorage.getItem("user").replace(/"/g, "") : <><br />Please Login</>}
          </Typography>
        </Typography>

        <Typography variant="h5" component="h2" sx={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '2rem',
        }}>
          {localStorage.getItem("status") == "loggedIn" ? "Logged In as " + localStorage.getItem("userType") : ""}
        </Typography>
      </Grid>
    </Grid>
  </div>);
}

export default Home;
