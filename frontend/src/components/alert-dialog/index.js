import { useState, useContext, createContext, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog() {
  const { isOpen, heading, body, setAlert, onAgree } = useAlert();

  const handleClose = () => {
    setAlert(false);
  };

  const handleAgree = () => {
    setAlert(false);
    onAgree?.();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{heading}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {body}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
        <Button onClick={handleAgree}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const agreeRef = useRef(null);

  const setAlert = (isOpen, title, msg) => {
    setIsOpen(isOpen);
    title && setHeading(title);
    msg && setBody(msg);
  };

  const setOnAgree = (onAgree) => {
    agreeRef.current = onAgree;
  };

  return (
    <AlertContext.Provider
      value={{
        isOpen,
        heading,
        body,
        setAlert,
        setOnAgree,
        onAgree: agreeRef.current,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
