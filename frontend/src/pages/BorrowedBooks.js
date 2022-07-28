import { useState, useEffect } from "react";
import { Paper, Grid, Container, Typography } from "@mui/material";
import { BookTile } from "../components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { snackbar } from "../components";
import { serverInfo } from "../utils";

const getAllBooksFromDb = async (setPostedBooks) => {
  const jwtToken = localStorage.getItem("AWS_JWT_TOKEN");
  const userId = localStorage.getItem("USER_ID");

  try {
    const response = await axios.get(serverInfo.baseUrl + serverInfo.books, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "content-type": "application/json",
      },
    });

    const allBooks = response.data.response.Items;
    setPostedBooks(
      allBooks.filter((book) => book.rentedBy && book.rentedBy === userId)
    );
  } catch (error) {
    console.log(`Error: ${error}`);
    snackbar.current.showSnackbar(true, error.message);
  }
};

const BorrowedBooks = () => {
  const [postedBooks, setPostedBooks] = useState([]);

  useEffect(() => {
    getAllBooksFromDb(setPostedBooks);
  }, []);

  return (
    <Container maxWidth="lg">
      <Paper sx={{ m: "50px", p: "30px" }}>
        {postedBooks.length < 1 && (
          <Typography variant="h6">No Books Borrowed</Typography>
        )}
        <Grid container spacing={3} rowGap={2}>
          {postedBooks.map((book) => (
            <Grid key={book.bookId} item xs={4}>
              <BookTile key={book.bookId} {...book} borrowedPage={true} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default BorrowedBooks;
