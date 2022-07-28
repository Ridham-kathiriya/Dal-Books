import {
  Container,
  Paper,
  Typography,
  TextField,
  Box,
  Button,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useInput from "../hooks/use-input";
import { snackbar } from "../components";
import UserPool from "../UserPool";
import { CognitoUser } from "amazon-cognito-identity-js";
import { regEx, simpleChangeHandler, onlyIntegerChangeHandler } from "../utils";

const verifyUser = (formData, navigate) => {
  const userData = {
    Username: formData.email,
    Pool: UserPool,
  };

  const cognitoUser = new CognitoUser(userData);
  cognitoUser.confirmPassword(formData.verificationCode, formData.password, {
    onFailure: (err) =>
      snackbar.current.showSnackbar(true, "Verification failed."),
    onSuccess: (res) => {
      snackbar.current.showSnackbar(true, "Password changed.");
      navigate("/login");
    },
  });
};

const Verification = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  let verificationFormIsValid = false;
  let passwordFormIsValid = false;
  const [firstPage, setFirstPage] = useState(true);

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    verifyUser(
      {
        email,
        verificationCode,
        password,
      },
      navigate
    );
  };
  const firstPageHandler = (event) => {
    event.preventDefault();
    setFirstPage(false);
  };

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

  const {
    value: verificationCode,
    isValid: verificationCodeIsValid,
    hasError: verificationCodeHasError,
    valueChangeHandler: verificationCodeChangeHandler,
    inputBlurHandler: verificationCodeBlurHandler,
  } = useInput((value) => value.length === 6, onlyIntegerChangeHandler);

  if (verificationCodeIsValid && emailIsValid) {
    verificationFormIsValid = true;
  }

  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput((value) => value.length >= 8, simpleChangeHandler);

  const {
    value: confirmPassword,
    isValid: confirmPasswordIsValid,
    hasError: confirmPasswordHasError,
    valueChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
  } = useInput((value) => value == password, simpleChangeHandler);

  if (passwordIsValid && confirmPasswordIsValid) {
    passwordFormIsValid = true;
  }
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
          {firstPage ? "Verification" : "Change Password"}
        </Typography>

        {firstPage && (
          <>
            <form onSubmit={firstPageHandler}>
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
              <TextField
                id="verification_code"
                label="Verification Code"
                variant="outlined"
                fullWidth={true}
                sx={{
                  mt: 2,
                }}
                value={verificationCode}
                onChange={verificationCodeChangeHandler}
                onBlur={verificationCodeBlurHandler}
                error={verificationCodeHasError}
                inputProps={{
                  maxLength: 6,
                }}
                helperText={
                  verificationCodeHasError && "Verification Code is required"
                }
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
                  disabled={!verificationFormIsValid}
                  color="secondary"
                >
                  Next
                </Button>
              </Box>
            </form>
          </>
        )}
        {!firstPage && (
          <form onSubmit={formSubmissionHandler}>
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth={true}
              sx={{
                mt: 2,
              }}
              value={password}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              error={passwordHasError}
              helperText={
                passwordHasError &&
                "Password is required with minimum 8 characters"
              }
            />
            <TextField
              id="confirm_password"
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth={true}
              sx={{
                mt: 2,
              }}
              value={confirmPassword}
              onChange={confirmPasswordChangeHandler}
              onBlur={confirmPasswordBlurHandler}
              error={confirmPasswordHasError}
              helperText={confirmPasswordHasError && "Passwords do not match."}
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
                disabled={!passwordFormIsValid}
                color="secondary"
              >
                Submit
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default Verification;
