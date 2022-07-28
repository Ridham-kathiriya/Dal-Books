import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const NavMenuPages = (props) => {
  const navigate = useNavigate();
  const { pages } = props;
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    if (page && page === "Home") {
      navigate("/");
    }
    if (page && page === "My Borrowed Books") {
      navigate("/borrowed-books");
    }
    setAnchorElNav(null);
  };

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
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
        onClose={() => handleCloseNavMenu()}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        {pages.map((page) => (
          <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
            <Typography textAlign="center">{page}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default NavMenuPages;
