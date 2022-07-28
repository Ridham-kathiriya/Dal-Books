import {
  Box,
  Grid,
  Link,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
} from "@mui/material";
import useInput from "../hooks/use-input";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";
import { regEx, simpleChangeHandler } from "../utils";
import { snackbar } from "../components";
import UserPool from "../UserPool";

const forgotPasswordCognito = (formData) => {
  const userData = {
    Username: formData.email,
    Pool: UserPool,
  };

  const cognitoUser = new CognitoUser(userData);

  cognitoUser.forgotPassword({
    onSuccess: (res) => console.log(JSON.stringify(res)),
    onFailure: (err) => console.log(err),
  });
};

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Email
  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput(
    (value) => regEx.email.test(value) === true,
    simpleChangeHandler
  );

  // Form Submit Handler
  const formSubmissionHandler = (event) => {
    event.preventDefault();

    forgotPasswordCognito({
      email,
    });
    snackbar.current.showSnackbar(true, "Verification Email Sent");
    navigate("/verification", { state: { email } });
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
          {"Send Verification Code"}
        </Typography>

        <form onSubmit={formSubmissionHandler}>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth={true}
            sx={{
              mt: 2,
            }}
            value={email}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            error={emailHasError}
            helperText={emailHasError && "Valid Email is required"}
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
              disabled={!emailIsValid}
              color="secondary"
            >
              Send Email
            </Button>
          </Box>
        </form>
        <Grid container justifyContent="flex-end">
          <Grid item xs>
            <Link
              variant="body2"
              onClick={() => navigate("/verification")}
              sx={{ cursor: "pointer" }}
            >
              {"Already have a code?"}
            </Link>
          </Grid>
          <Grid item>
            <Link
              variant="body2"
              onClick={() => navigate("/login")}
              sx={{ cursor: "pointer" }}
            >
              {"Cancel"}
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
