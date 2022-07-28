import { useState } from "react";
import { MaterialSnackbar } from "./components";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import AlertDialog, { AlertProvider } from "./components/alert-dialog";
import { snackbarRef } from "./components/material-snackbar";
import { AuthContext, PointsContext } from "./context";

function App() {
  const [isLogin, setLogin] = useState(
    localStorage.getItem("USER_ID") ? true : false
  );
  const [userPoints, setUserPoints] = useState(
    localStorage.getItem("USER_POINTS")
      ? +localStorage.getItem("USER_POINTS")
      : 0
  );
  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ isLogin, setLogin }}>
        <PointsContext.Provider value={{ userPoints, setUserPoints }}>
          <BrowserRouter>
            <AlertProvider>
              <CssBaseline />
              <AppRoutes />
              <AlertDialog />
              <MaterialSnackbar ref={snackbarRef} />
            </AlertProvider>
          </BrowserRouter>
        </PointsContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
