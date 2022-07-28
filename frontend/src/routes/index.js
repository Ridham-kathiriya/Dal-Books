import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context";
import { Navbar } from "../components";
import {
  Home,
  Login,
  Signup,
  ForgotPassword,
  AddBook,
  Review,
  Verification,
  BorrowedBooks,
  BookReviews
} from "../pages";

const AppRoutes = () => {
  const { isLogin } = useAuth();
  console.log({ isLogin });
  return (
    <Routes>
      <Route element={<WithoutNavbar />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verification" element={<Verification />}></Route>
      </Route>
      <Route
        path="*"
        element={
          <RequireAuth>
            <ProtectedRoutes />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route element={<WithNavbar />}>
        <Route path="/" element={<Home />} />
        <Route path="/borrowed-books" element={<BorrowedBooks />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/add-review/:id" element={<Review />} />
        <Route path="/book-reviews/:id" element={<BookReviews />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
};

const RequireAuth = ({ children }) => {
  const { isLogin } = useAuth();

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const WithNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const WithoutNavbar = () => <Outlet />;

export default AppRoutes;
