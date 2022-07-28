import AppBar from "@mui/material/AppBar";
import { Box, Toolbar, Container, Button, Avatar } from "@mui/material/";
import NavTitle from "./nav-title";
import NavMenuPages from "./nav-menu-pages";
import NavCreateButton from "./nav-create-button";
import NavUser from "./nav-user";
import { useNavigate } from "react-router-dom";

const pages = ["Home", "My Borrowed Books"];

const Navbar = () => {
  const navigate = useNavigate();

  const navigateToPage = (page) => {
    if (page === "Home") {
      navigate("/");
    }
    if (page === "My Borrowed Books") {
      navigate("/borrowed-books");
    }
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Avatar
            src={
              "https://icon-library.com/images/icon-for-books/icon-for-books-29.jpg"
            }
            sx={{ marginRight: "4px" }}
          />
          <NavTitle
            title="DalBooks"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
            }}
          />

          <NavMenuPages pages={pages} />

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => navigateToPage(page)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <NavCreateButton />

          <NavUser />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
