import { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
  Link,
} from "@mui/material";
import axios from "axios";
import { serverInfo } from "../../utils";
import { snackbar } from "../../components";
import { PointsContext } from "../../context";
import { useNavigate } from "react-router-dom";

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

const updateBookRented = async (props, setRented) => {
  const jwtToken = localStorage.getItem("AWS_JWT_TOKEN");
  const userId = localStorage.getItem("USER_ID");

  try {
    const response = await axios.put(
      serverInfo.baseUrl + serverInfo.books,
      {
        bookId: props.bookId,
        title: props.title,
        description: props.description,
        author: props.author,
        points: props.points,
        imageUrl: props.imageUrl,
        userId: props.userId,
        rentedBy: userId,
        isRented: true,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "content-type": "application/json",
        },
      }
    );
    setRented(true);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const returnBookRented = async (props, setRented) => {
  const jwtToken = localStorage.getItem("AWS_JWT_TOKEN");
  const userId = localStorage.getItem("USER_ID");

  try {
    const response = await axios.put(
      serverInfo.baseUrl + serverInfo.books,
      {
        bookId: props.bookId,
        title: props.title,
        description: props.description,
        author: props.author,
        points: props.points,
        imageUrl: props.imageUrl,
        userId: props.userId,
        rentedBy: "",
        isRented: false,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "content-type": "application/json",
        },
      }
    );
    setRented(false);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const updateUser = async (user) => {
  const jwtToken = localStorage.getItem("AWS_JWT_TOKEN");

  try {
    const response = await axios.post(serverInfo.baseUrl + serverInfo.users, {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      points: user.points,
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const BookTile = (props) => {
  const navigate = useNavigate();
  const fromBorrowedPage = props.borrowedPage ? true : false;
  const { userPoints, setUserPoints } = useContext(PointsContext);
  const [isRented, setRented] = useState(props.isRented);
  const [postedByMe, setPostedByMe] = useState(false);

  const [postedUser, setPostedUser] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    points: 0,
  });

  const loggedInUser = {
    userId: localStorage.getItem("USER_ID"),
    firstName: localStorage.getItem("USER_FIRST_NAME"),
    lastName: localStorage.getItem("USER_LAST_NAME"),
    email: localStorage.getItem("USER_EMAIL"),
    points: userPoints,
  };

  useEffect(() => {
    if (props.userId !== loggedInUser.userId) {
      getUserDetails(props.userId, setPostedUser);
    } else {
      setPostedUser(loggedInUser);
      setPostedByMe(true);
    }
  }, []);

  const borrowClickHandler = (event) => {
    const loggedInUserPoints = +localStorage.getItem("USER_POINTS");

    if (props.points > loggedInUserPoints) {
      snackbar.current.showSnackbar(true, "Not enough points!");
      return;
    }

    const loggedInUserNewPoints = loggedInUserPoints - props.points;
    const postedUserPoints = +postedUser.points + +props.points;
    const newPostedUser = {
      userId: postedUser.userId,
      firstName: postedUser.firstName,
      lastName: postedUser.lastName,
      email: postedUser.email,
      points: postedUserPoints,
    };

    loggedInUser.points = loggedInUserNewPoints;
    setPostedUser(newPostedUser);
    setUserPoints(loggedInUserNewPoints);
    updateBookRented(props, setRented);

    localStorage.setItem("USER_POINTS", loggedInUserNewPoints);
    updateUser(loggedInUser);
    updateUser(newPostedUser);
    snackbar.current.showSnackbar(true, "Book Successfully Borrowed!");
  };

  const returnClickHandler = (event) => {
    returnBookRented(props, setRented);
    snackbar.current.showSnackbar(true, "Book Returned Successfully!");
  };

  return (
    <Card>
      <CardActionArea component={Link} to={`/book/${props.bookId}`}>
        <CardMedia
          component="img"
          image={props.imageUrl}
          sx={{
            height: {
              xs: 150,
              md: 200,
            },
            width: { md: "100%" },
          }}
        />
        <CardContent>
          {!fromBorrowedPage && (
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  variant="body2"
                  onClick={() => navigate("/book-reviews/" + props.bookId)}
                  sx={{ cursor: "pointer" }}
                >
                  {"Reviews"}
                </Link>
              </Grid>
            </Grid>
          )}
          <Typography variant="h6">{props.title}</Typography>
          <Typography sx={{ color: "#888" }} variant="caption">
            {props.description}
          </Typography>
          <br />
          <Typography sx={{ color: "#888" }} variant="overline">
            {`${props.author}`}
          </Typography>
          <br />
          <Typography sx={{ color: "#888" }} variant="caption">
            {`Posted by: ${postedUser.firstName} ${postedUser.lastName}`}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Divider></Divider>
      <CardActions>
        <Grid container>
          <Grid textAlign="center" item xs={6}>
            {!fromBorrowedPage && (
              <Typography sx={{ color: "#888" }} variant="overline">
                {props.points} Points Needed
              </Typography>
            )}
            {fromBorrowedPage && (
              <Link
                variant="body2"
                onClick={() => navigate("/add-review/" + props.bookId)}
                sx={{ cursor: "pointer" }}
              >
                <Typography sx={{ color: "#2980b9" }} variant="overline">
                  Add Review
                </Typography>
              </Link>
            )}
          </Grid>

          <Grid item xs={6} sx={{ display: { xs: "none", sm: "block" } }}>
            {!fromBorrowedPage && (
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                disabled={isRented || postedByMe}
                onClick={borrowClickHandler}
              >
                {isRented && !postedByMe && "Borrowed"}
                {postedByMe && "My Book"}
                {!isRented && !postedByMe && "Borrow"}
              </Button>
            )}
            {fromBorrowedPage && (
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={returnClickHandler}
                disabled={!isRented}
              >
                Return Book
              </Button>
            )}
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default BookTile;
