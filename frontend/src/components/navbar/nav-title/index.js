import { Typography } from "@mui/material";
import React from "react";

const NavTitle = (props) => {
  return (
    <Typography
      variant="h6"
      noWrap
      component="a"
      href="/"
      sx={{
        ...props.sx,
        ...styling.title,
      }}
    >
      {props.title}
    </Typography>
  );
};

export default NavTitle;

const styling = {
  title: {
    mr: 2,
    fontWeight: 700,
    color: "white",
    textDecoration: "none",
  },
};
