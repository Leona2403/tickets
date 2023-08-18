import React, { useState, useEffect } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "../assets/profile.png";
import {
  AppBar,
  useTheme,
  Toolbar,
  IconButton,
  InputBase,
  Button,
  Box,
  Typography,
  Menu,
  MenuItem,
  useMediaQuery,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, onLogout }) => {
  const API_URL = process.env.API_URL;
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateFirstName, setUpdateFirstName] = useState("");
  const [updateLastName, setUpdateLastName] = useState("");
  const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(true);

  //Handle Logout and navigate to / route.
  const handleLogout = () => {
    alert("Really Want to LoggedOut!!");
    localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setUpdateFirstName(user?.firstName || "");
    setUpdateLastName(user?.lastName || "");
    setIsUpdateButtonDisabled(true);
  };

  const handleFirstNameChange = (e) => {
    setUpdateFirstName(e.target.value);
    setIsUpdateButtonDisabled(false);
  };

  const handleLastNameChange = (e) => {
    setUpdateLastName(e.target.value);
    setIsUpdateButtonDisabled(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleUpdateDetails = () => {};

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3002/user/${userId}`)
        .then((response) => {
          if (response.status === 200) {
            const fetchedUser = response.data.data;
            setUser(fetchedUser);
          } else {
            console.log("Problem with fetching user details");
          }
        })
        .catch((error) => {
          console.log("Error fetching user details", error);
        });
    }
  }, [userId]);

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
        // sticky at top
        top: "0",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          {isNonMediumScreens && (
            <FlexBetween
              backgroundColor={theme.palette.background.alt}
              borderRadius="9px"
              gap="3rem"
              p="0.1rem 1.5rem"
            >
              <InputBase placeholder="Search..." />
              <IconButton>
                <Search />
              </IconButton>
            </FlexBetween>
          )}
        </FlexBetween>
        {/* RIGHT SIDE */}

        <FlexBetween gap="1.5rem">
          <IconButton>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton onClick={handleOpenDialog}>
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user?.email}
                </Typography>
                <Typography
                  fontSize="0.75rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user?.role}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        PaperProps={{
          style: {
            width: "60vh",
            height: "100vh",
          },
        }}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <DialogTitle>Update User Details</DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
              marginTop: "2rem",
            }}
          >
            <TextField
              label="First Name"
              variant="outlined"
              value={updateFirstName}
              onChange={handleFirstNameChange}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              value={updateLastName}
              onChange={handleLastNameChange}
            />

            <TextField
              label="email"
              variant="outlined"
              value={user?.email}
              disabled
            />

            <TextField
              label="role"
              variant="outlined"
              value={user?.role}
              disabled
            />
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            {/* cancel and upate button */}
            <Button varian="outlined" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={isUpdateButtonDisabled}
              onClick={handleUpdateDetails}
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
