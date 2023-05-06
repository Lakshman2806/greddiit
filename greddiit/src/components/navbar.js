import { Link, useNavigate,useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthcontext";
import AppBar from "@mui/material/AppBar";
import * as React from "react";
// import AppBar from '@mui/material/AppBar';
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useLogOut } from "../hooks/useLogOut";
import { useState,useEffect } from "react";
import { useNavContext } from "../hooks/useNavcontext";
const pages = [];
const settings = ["Profile", "Logout"];

// Why does one use Material UI when the modularity of the components is so poor?

const NavBar = () => {
  const { user } = useAuthContext();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const openNavMenu = Boolean(anchorElNav);
  const openUserMenu = Boolean(anchorElUser);
  const navigate = useNavigate();
  const { logout } = useLogOut();
  const { nav, dispatch} = useNavContext();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  



  const navigatetoprofile = () => {
    console.log("navigate to profile");
    console.log("why is this not working");
    navigate("/profile");
    // replace: true is used to prevent the user from going back to the previous page
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar position="sticky" color="inherit">
      <Container maxWidth="l">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.1rem",
              color: "primary",
              textDecoration: "none",
            }}
            cursor="pointer"
          >
            <div className="Button">GREDDIIT</div>
          </Typography>
          {/* <Link to="/profile"> */}
          {user && (
            <Typography
              variant="h6"
              noWrap
              component="a"
              // window.location.href = "http://localhost:3000/profile"

              onClick={navigatetoprofile}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <div className="Button">Profile</div>
              {/* <Button>Profile</Button> */}
            </Typography>
          )}

          {user && (
            <Typography
              variant="h6"
              noWrap
              component="a"
              // window.location.href = "http://localhost:3000/profile"

              onClick={() => {
                navigate("/mysubgreddiits");
              }}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <div className="Button">My Subgreddits</div>
              {/* <Button>Profile</Button> */}
            </Typography>
          )}
          
          {user && (
            <Typography
              variant="h6"
              noWrap
              component="a"
              // window.location.href = "http://localhost:3000/profile"

              onClick={() => {
                navigate("/subgreddiit");
              }}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <div className="Button">Subgreddits</div>
              {/* <Button>Profile</Button> */}
            </Typography>
          )}
          {user && (
            <Typography
              variant="h6"
              noWrap
              component="a"
              // window.location.href = "http://localhost:3000/profile"

              onClick={() => {
                navigate("/savedposts");
              }}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <div className="Button">Saved Posts</div>
              {/* <Button>Profile</Button> */}
            </Typography>
          )}

          {/* </Link> */}
          {/* <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}> */}
          {/* <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton> */}
          {/* <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu> */}
          {/* </Box> */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>{user.user.Username[0].toUpperCase()}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={logout}>
                  <Typography textAlign="center">LogOut</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  <Typography textAlign="center" sx={{ color: "primary.text" }}>
                    profile
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <Typography
                    textAlign="center"
                    sx={{ color: "primary.text" }}
                    onClick={() => {
                      navigate("/mysubgreddiits");
                    }}
                  >
                    My Subgreddits
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <Typography
                    textAlign="center"
                    sx={{ color: "primary.text" }}
                    onClick={() => {
                      navigate("/subgreddiit");
                    }}
                  >
                    Subgreddits
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
