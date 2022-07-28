import { useState, useRef } from "react";
import {
  Paper,
  Stack,
  IconButton,
  Button,
  Box,
  styled,
  TextField,
  Container,
  Grid,
} from "@mui/material";
import { DeleteRounded, ImageRounded } from "@mui/icons-material";
import "./Addbook.css";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { uuidv4 } from "@firebase/util";
import { serverInfo, simpleChangeHandler, onlyIntegerChangeHandler } from "../utils";
import useInput from "../hooks/use-input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { snackbar } from "../components";
import { v4 } from "uuid";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const AddBook = () => {
  const navigate = useNavigate();
  // Title
  const {
    value: title,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitleInput,
  } = useInput((value) => value.trim() !== "", simpleChangeHandler);

  // Description
  const {
    value: description,
    isValid: descriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescriptionInput,
  } = useInput((value) => value.trim() !== "", simpleChangeHandler);

  // Author
  const {
    value: author,
    isValid: authorIsValid,
    hasError: authorHasError,
    valueChangeHandler: authorChangeHandler,
    inputBlurHandler: authorBlurHandler,
    reset: resetAuthorInput,
  } = useInput((value) => value.trim() !== "", simpleChangeHandler);

  // Points
  const {
    value: points,
    isValid: pointsIsValid,
    hasError: pointsHasError,
    valueChangeHandler: pointsChangeHandler,
    inputBlurHandler: pointsBlurHandler,
    reset: resetPointsInput,
  } = useInput((value) => value > 0 && value < 5, onlyIntegerChangeHandler);

  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const fileInput = useRef(null);


  const onDeleteImage = (url) => {
    const filteredImages = images.filter((image) => image != url);
    setImages(filteredImages);
  };

  const onImageSelect = (e) => {
    if (e.target.files) {
      const fileList = e.target.files;
      const newImages = [];
      let lastId = images.length;

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const url = URL.createObjectURL(file);
        const id = lastId + 1;
        newImages.push(url);
        lastId = id;
      }

      setImages((oldImages) => [...newImages]);
      uploadImage(fileList[0]);
    }
  };

  const uploadImage = (file) => {
    // Make the path unique by adding UUID before filename maybe.
    const filePath = "/bookImgs/" + v4() + file.name;
    const storageRef = ref(storage, filePath);

    uploadBytes(storageRef, file)
      .then(() => {
        getDownloadURL(storageRef)
          .then((url) => {
            setImageUrl(url);
          })
          .catch((error) => {
            console.error(error.message);
          });
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const onImageChange = (e) => {
    if (fileInput.current != null) {
      fileInput.current.click();
    }
  };

  const saveBookToDb = async () => {
    const jwtToken = localStorage.getItem("AWS_JWT_TOKEN");
    const userId = localStorage.getItem("USER_ID");

    try {
      const response = await axios.post(
        serverInfo.baseUrl + serverInfo.books,
        {
          bookId: v4(),
          title: title,
          description: description,
          author: author,
          points: points,
          imageUrl: imageUrl,
          userId: userId,
          isRented: false
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      snackbar.current.showSnackbar(true, response.data.message);
      navigate("/home");
    } catch (error) {
      console.log(`Error: ${error}`);
      snackbar.current.showSnackbar(true, error.message);
    }
  };

  let formIsValid = false;

  if (
    titleIsValid &&
    descriptionIsValid &&
    authorIsValid &&
    pointsIsValid &&
    imageUrl.trim() !== ""
  ) {
    formIsValid = true;
  }

  const formSubmitHandler = (event) => {
    event.preventDefault();
    saveBookToDb();
    
  };

  return (
    <form onSubmit={formSubmitHandler}>
      <Container maxWidth="md">
        <Paper sx={{ m: "50px", p: "30px" }}>
          <Stack direction="column" spacing={2}>
            <TextField
              id="standard-Title"
              label="Title"
              variant="standard"
              required
              margin="normal"
              value={title}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
              error={titleHasError}
              helperText={titleHasError && "Title is required"}
              InputProps={{ style: { fontSize: 30 } }}
              InputLabelProps={{ style: { fontSize: 20 } }}
            />

            <TextField
              id="standard-multiline-flexible"
              label="Description"
              multiline
              maxRows={4}
              value={description}
              onChange={descriptionChangeHandler}
              onBlur={descriptionBlurHandler}
              error={descriptionHasError}
              helperText={descriptionHasError && "Description is required"}
              variant="standard"
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  id="standard-Title"
                  label="Author"
                  variant="standard"
                  margin="normal"
                  value={author}
                  onChange={authorChangeHandler}
                  onBlur={authorBlurHandler}
                  error={authorHasError}
                  helperText={authorHasError && "Author is required"}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="standard-Title"
                  label="Points"
                  variant="standard"
                  margin="normal"
                  value={points}
                  onChange={pointsChangeHandler}
                  onBlur={pointsBlurHandler}
                  error={pointsHasError}
                  helperText={pointsHasError && "Points should be between 1 - 4"}
                />
              </Grid>
            </Grid>
          </Stack>
          <br />

          {images.length > 0 && (
            <Box className="img-list">
              {images.map((image, index) => (
                <div className="img-container" key={index + ""}>
                  <img className="img" src={image} width="350" height="350" />
                  <IconButton
                    sx={styling.btnDelete}
                    onClick={() => onDeleteImage(image)}
                  >
                    <DeleteRounded />
                  </IconButton>
                </div>
              ))}
            </Box>
          )}

          <Stack direction="row" sx={styling.btnContainer}>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInput}
              onChange={onImageSelect}
            />
            <IconButton onClick={onImageChange}>
              <ImageRounded fontSize="medium" />
            </IconButton>
            <Box sx={{ m: 1, position: "relative" }}>
              <Button type="submit" variant="contained" color="secondary" disabled={!formIsValid}>
                Add Book
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </form>
  );
};

export default AddBook;

const styling = {
  btnDelete: {
    position: "absolute",
    top: "2%",
    right: "2%",
  },
  progress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-12px",
    marginLeft: "-12px",
  },
  btnContainer: {
    justifyContent: "space-between",
    alignItems: "center",
  },
};
