import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const options = ["Post", "Group", "Event", "Blog"];

const NavCreateButton = () => {
  const navigate = useNavigate();

  const addBookClickHandler = (event) => {
    navigate("/add-book");

    // setAnchorElCreate(null);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      onClick={addBookClickHandler}
      sx={{ cursor: "pointer" }}
    >
      <AddIcon />
      <Button sx={{ mr: 2, color: "white", display: "block" }}>Add Book</Button>
    </Stack>
  );
};

export default NavCreateButton;
