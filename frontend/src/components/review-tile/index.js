import { useState, useEffect, useContext } from "react";
import { Paper, Typography, Container, Grid } from "@mui/material";
import axios from "axios";
import { serverInfo } from "../../utils";

const getUserDetails = async (userId, setPostedUser) => {
  const jwtToken = localStorage.getItem("AWS_JWT_TOKEN");

  try {
    const response = await axios.get(
      serverInfo.baseUrl + serverInfo.users + "/" + userId,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "content-type": "application/json",
        },
      }
    );
    setPostedUser(response.data.data.Item);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const ReviewTile = (props) => {
  let backgroundColor = {
    POSITIVE: "#27ae60",
    NEGATIVE: "#c0392b",
    MIXED: "#2c3e50",
  };

  const [postedUser, setPostedUser] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const loggedInUser = {
    userId: localStorage.getItem("USER_ID"),
    firstName: localStorage.getItem("USER_FIRST_NAME"),
    lastName: localStorage.getItem("USER_LAST_NAME"),
    email: localStorage.getItem("USER_EMAIL"),
  };

  useEffect(() => {
    if (props.userId !== loggedInUser.userId) {
      getUserDetails(props.userId, setPostedUser);
    } else {
      setPostedUser(loggedInUser);
    }
  }, []);

  return (
    <Container maxWidth="md">
      <Paper sx={{ m: "4px", p: "4px" }}>
        <Typography variant="body" sx={{ lineHeight: 1.2, padding: 2 }}>
          {props.review}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            paddingX: 1,
            paddingY: 0.25,
            backgroundColor: backgroundColor[props.sentiment],
            borderRadius: 2,
            color: "#FFFFFF",
          }}
        >
          {props.sentiment}
        </Typography>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Typography variant="caption" sx={{ padding: 2 }}>
              {`Posted by ${postedUser.firstName} ${postedUser.lastName}`}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ReviewTile;
