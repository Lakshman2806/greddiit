import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthcontext";
import { useLogOut } from "../hooks/useLogOut";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSignup } from "../hooks/useRegister";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";
import { InputAdornment } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import blue from "@mui/material/colors/blue";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
// import ListItemButton from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FollowerUI from "../components/follower";
import FollowingUI from "../components/following";
import { textAlign } from "@mui/system";
import { useNavContext } from "../hooks/useNavcontext";
import Alert from "@mui/material";
import Pageload from "./pageload";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// const theme = createTheme();

const emails = [];

const Profile = () => {
  const { user } = useAuthContext();
  const { logout } = useLogOut();
  const { nav, dispatch } = useNavContext();
  const [Age, setAge] = useState("12");
  const [Username, setUsername] = useState("admin");
  const [Email, setEmail] = useState("admin@gmail.com");
  const [First_name, setFirst_name] = useState("admin");
  const [Last_name, setLast_name] = useState("admin");
  const [Contact_number, setContact_number] = useState("1234567890");
  const [Password, setPassword] = useState(null);
  const [Followers, setFollowers] = useState(0);
  const [Following, setFollowing] = useState(0);
  const [ListofFollowers, setListofFollowers] = useState([]);
  const [ListofFollowing, setListofFollowing] = useState([]);
  const [openFollowers, setOpenFollowers] = useState(false);
  const [openFollowing, setOpenFollowing] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [pageload, setPageload] = useState(true);
  // const [selectedValue, setSelectedValue] = useState(emails[1]);
  // dispatch({ type: "NO_NAV", payload: "profile"})
  useEffect(() => {
    dispatch({ type: "NO_NAV", payload: "profile" });
  }, []);
  const handleClickOpenFollowers = () => {
    setOpenFollowers(true);
  };

  const handleClickOpenFollowing = () => {
    setOpenFollowing(true);
  };

  const handleCloseFollowers = (value) => {
    setOpenFollowers(false);
    // setSelectedValue(value);
  };

  const handleCloseFollowing = (value) => {
    setOpenFollowing(false);
    // setSelectedValue(value);
  };

  function SimpleDialog(props) {
    const { onClose, selectedValue, open, listtodisplay, title } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
      onClose(value);
    };

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>{title}</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem>
            {listtodisplay.length == 0 && <h1>No {title}</h1>}
            {listtodisplay &&
              listtodisplay.map((id) => {
                // const [f, setF] = useState(true);
                return (
                  <div>
                    {/* <h1>lall</h1> */}
                    {
                      title == "Followers" &&
                      <FollowerUI
                        id={id}
                        Followers={Followers}
                        setFollowers={setFollowers}
                      />
                    }
                    {
                      title == "Following" &&
                      <FollowingUI
                        id={id}
                        Following={Following}
                        setFollowing={setFollowing}
                      />
                    }
                    {/* <Button onClick={setF(false)}>Delete</Button> */}
                  </div>
                );
              })}
          </ListItem>
        </List>
      </Dialog>
    );
  }

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:4000/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setAge(data.Age);
        setUsername(data.Username);
        setEmail(data.Email);
        setFirst_name(data.First_name);
        setLast_name(data.Last_name);
        setContact_number(data.Contact_number);
        setPassword(data.Password);
        setFollowers(data.Followers.length);

        // console.log("Size " + data.Followers.length)
        setFollowing(data.Following.length);
        setListofFollowers(data.Followers);
        setListofFollowing(data.Following);
        setPageload(false);
        // console.log(ListofFollowers)
        // console.log(data.Followers);
      } else {
        console.log(data.err);
        logout();
      }
      //   setProfile(DATY);
    };
    if (user) {
      fetchUser();
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // signup(firstName, lastName, username, email, age, Contact_number, password);
    setIsloading(true);
    const data = {
      First_name,
      Last_name,
      Username,
      Email,
      Age,
      Contact_number,
      Password,
    };
    console.log(data);
    const res = await fetch("http://localhost:4000/api/user/profile", {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(data),
    });
    const newdata = await res.json();
    if (res.ok) {
      console.log("Successful");
      alert("Profile Updated Successfully")
    } else {
      console.log(res);
      console.log("Unsuccessful");

    }
    setIsloading(false);
  };

  return (
    <>
    {pageload ? ( <Pageload /> ) : (
    <Card
      sx={{
        marginTop: 1,
        alignSelf: "center",
        // maxWidth: 500,
        maxWidth: "md",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
      className="card"
    >
      <CardContent>
        <Container component="main" maxWidth="md">
          <CssBaseline />

          <span>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  m: 1,
                  bgcolor: "secondary.main",
                }}
              >
                {First_name[0].toUpperCase()}
              </Avatar>

              <Box
                sx={{
                  marginTop: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Typography component="h1" variant="h6" sx={{}}>
                          {/* <div style={textAlign}> */}
                          <div className="Followers">
                            Followers : {Followers}
                          </div>
                          <div>
                            <div className="FollowerBtn">
                              <Button
                                variant="outlined"
                                onClick={handleClickOpenFollowers}
                              >
                                Show Followers
                              </Button>
                            </div>
                            <SimpleDialog
                              selectedValue={"Hi"}
                              open={openFollowers}
                              onClose={handleCloseFollowers}
                              listtodisplay={ListofFollowers}
                              title="Followers"
                            />
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Typography component="h5" variant="h6">
                          <div className="Following">
                            Following : {Following}
                          </div>
                          <div>
                            <div className="FollowingBtn">
                              <span>
                                <Button
                                  variant="outlined"
                                  onClick={handleClickOpenFollowing}
                                >
                                  Show Following
                                </Button>
                              </span>
                            </div>
                            <SimpleDialog
                              selectedValue={"hi"}
                              open={openFollowing}
                              onClose={handleCloseFollowing}
                              listtodisplay={ListofFollowing}
                              title="Following"
                            />
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <br />
                <br></br>
                {/* <span>Hi</span> */}
                <span>
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          autoComplete="given-name"
                          name="firstName"
                          required
                          fullWidth
                          id="outlined-required"
                          value={First_name}
                          onChange={(e) => setFirst_name(e.target.value)}
                          label="First Name"
                          defaultValue="None"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          id="lastName"
                          value={Last_name}
                          onChange={(e) => setLast_name(e.target.value)}
                          label="Last Name"
                          name="lastName"
                          autoComplete="family-name"
                          defaultValue="None"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="Username"
                          value={Username}
                          onChange={(e) => setUsername(e.target.value)}
                          label="Username"
                          name="Username"
                          autoComplete="Username"
                          defaultValue="None"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="email"
                          value={Email}
                          onChange={(e) => setEmail(e.target.value)}
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          defaultValue="None"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="Age"
                          value={Age}
                          onChange={(e) => setAge(e.target.value)}
                          label="Age"
                          name="Age"
                          defaultValue="None"
                          autoComplete="Age"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="Contact_number"
                          value={Contact_number}
                          onChange={(e) => setContact_number(e.target.value)}
                          label="Contact_number"
                          name="Contact_number"
                          autoComplete="Contact_number"
                          defaultValue="None"
                        />
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      // disabled
                      disabled={!First_name || !Last_name || !Username || !Email || !Age || !Contact_number || isloading}
                    >
                      Edit
                    </Button>
                  </Box>
                </span>
              </Box>
            </Box>
          </span>
          {/* <Copyright sx={{ mt: 5 }} /> */}
        </Container>
        {/* </span> */}
      </CardContent>
    </Card>
    )}
    </>
  );
};
export default Profile;
