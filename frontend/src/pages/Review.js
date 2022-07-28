import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
} from "@mui/material";
import useInput from "../hooks/use-input";
import { serverInfo, simpleChangeHandler } from "../utils";
import { useNavigate } from "react-router-dom";
import { snackbar } from "../components";
import axios from "axios";
import { v4 } from "uuid";

const saveReviewToDb = async (review, params, navigate) => {
  const jwtToken = localStorage.getItem("AWS_JWT_TOKEN");
  const userId = localStorage.getItem("USER_ID");

  try {
    const response = await axios.post(
      serverInfo.baseUrl + serverInfo.reviews,
      {
        reviewId: v4(),
        bookId: params.id,
        userId: userId,
        review: review,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    snackbar.current.showSnackbar(true, "Review Added!");
    navigate("/borrowed-books");
  } catch (error) {
    console.log(`Error: ${error}`);
    snackbar.current.showSnackbar(true, error.message);
  }
};

const Review = () => {
  const params = useParams();
  const navigate = useNavigate();

  // Review
  const {
    value: review,
    isValid: reviewIsValid,
    hasError: reviewHasError,
    valueChangeHandler: reviewChangeHandler,
    inputBlurHandler: reviewBlurHandler,
    reset: resetReviewInput,
  } = useInput((value) => value.trim() !== "", simpleChangeHandler);

  let formIsValid = !reviewHasError;

  const formSubmissionHandler = (e) => {
    e.preventDefault();
    saveReviewToDb(review, params, navigate);
  };

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
          {"Review the book"}
        </Typography>
        <form onSubmit={formSubmissionHandler}>
          <TextField
            id="review"
            label="Review"
            variant="outlined"
            fullWidth={true}
            multiline={true}
            sx={{
              mt: 2,
            }}
            value={review}
            onChange={reviewChangeHandler}
            onBlur={reviewBlurHandler}
            error={reviewHasError}
            helperText={reviewHasError && "Review is required"}
          />

          <Box
            sx={{ mt: 4, position: "relative" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              type="submit"
              variant="contained"
              disabled={!formIsValid}
              color="secondary"
            >
              Post Review
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Review;
