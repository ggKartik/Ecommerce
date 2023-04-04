import "./App.css";
import Header from "./component/layout/header/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import webfont from "webfontloader";
import React, { useEffect } from "react";
import Footer from "./component/layout/footer/Footer";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/product/ProductDetails";
import Products from "./component/product/Products";
import Search from "./component/product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import { useSelector } from "react-redux";
import UserOptions from "./component/layout/header/UserOptions";
import Profile from "./component/User/Profile";
import ProtectedRoute from "./component/route/ProtectedRoute";
import EditProfile from "./component/User/EditProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import { useDispatch } from "react-redux";
import OrderSuccess from "./component/Cart/OrderSuccess";
import Orders from "./component/Orders/Orders";
import OrderDetails from "./component/Orders/OrderDetails";
import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/ProductList";
import CreateProduct from "./component/Admin/CreateProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import UserList from "./component/Admin/UserList";
import OrderStatus from "./component/Admin/OrderStatus";
import UserRole from "./component/Admin/UserRole";
import Reviews from "./component/Admin/Reviews";
function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    webfont.load({
      google: {
        families: ["Roboto", "Droid sans"],
      },
    });

    store.dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Header />
      {isAuthenticated && user !== undefined && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/Cart" element={<Cart />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Profile />} />
          <Route path="/me/update" element={<EditProfile />} />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="/order/confirm" element={<ConfirmOrder />} />
          <Route path="/order/success" element={<OrderSuccess />} />
          <Route path="/orders/me" element={<Orders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
        </Route>

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/createProduct" element={<CreateProduct />} />
        <Route path="/admin/product/:id" element={<UpdateProduct />} />
        <Route path="/admin/orders" element={<OrderList />} />
        <Route path="/admin/order/:id" element={<OrderStatus />} />
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/users/:id" element={<UserRole />} />
        <Route path="/admin/reviews" element={<Reviews />} />
      </Routes>
      <Footer />
    </Router>
  );
}
export default App;
