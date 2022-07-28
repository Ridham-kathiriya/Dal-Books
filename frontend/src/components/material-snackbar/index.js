import { createRef, forwardRef, useImperativeHandle, useState } from "react";
import Snackbar from "@mui/material/Snackbar";

export const snackbarRef = createRef();
export const snackbar = snackbarRef;

const MaterialSnackbar = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useImperativeHandle(ref, () => ({
    open,
    showSnackbar,
  }));

  const showSnackbar = (open, message) => {
    setOpen(open);
    message && setMessage(message);
  };

  const closeSnackbar = () => showSnackbar(false);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={closeSnackbar}
      message={message}
    />
  );
});

export default MaterialSnackbar;
