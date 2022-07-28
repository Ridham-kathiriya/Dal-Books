import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReviewTile } from "../components";
import {
  Container,
  Paper,
  Grid,
  Typography,
} from "@mui/material";
import { serverInfo } from "../utils";
import { snackbar } from "../components";
import axios from "axios";

const getBookReviewsFromDb = async (setReviews, bookId) => {
  const jwtToken = localStorage.getItem("AWS_JWT_TOKEN");

  try {
    const response = await axios.get(
      serverInfo.baseUrl + serverInfo.books + "/" + bookId + serverInfo.reviews,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    setReviews(response.data.data.Items)
  } catch (error) {
    console.log(`Error: ${error}`);
    snackbar.current.showSnackbar(true, error.message);
  }
};

const BookReviews = () => {
  const [reviews, setReviews] = useState([]);
  const params = useParams();

  useEffect(() => {
    getBookReviewsFromDb(setReviews, params.id);
  }, []);

  return (
    <Container maxWidth="md">
      <Paper sx={{ m: "50px", p: "30px" }}>
        <Typography
          variant="h5"
          component="h5"
          sx={{ lineHeight: 1.2, mb: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {"Book Reviews"}
        </Typography>

        {reviews.length < 1 && (
          <Typography variant="h6">No Reviews Found!</Typography>
        )}

        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid key={review.reviewId} item xs={12}>
              <ReviewTile key={review.reviewId} {...review} />
            </Grid>
          ))}
        </Grid>
       
      </Paper>
    </Container>
  );
};

export default BookReviews;