import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Marketplace from "../pages/Marketplace";
import AboutUs from "../pages/AboutUs";
import Login from "../pages/Login";
import Events from "../pages/Events";
import PlanEvent from "../pages/PlanEvent";
import Eventpage from "../pages/Eventpage";
import Favorites from "../pages/Favorites";
import Productpage from "../pages/AddProduct";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import Productpages from "../pages/Productpages";
import OrderHistory from "../pages/OrderHistory";
import AccountProducts from "../pages/AccountProducts";
// import Product from "../pages/product";
// import "../styles/Contents.css";

function Contents() {
  return (
    <div className="contents">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/marketplace" element={<Marketplace />}></Route>
        <Route path="/about-us" element={<AboutUs />}></Route>
        <Route path="/events" element={<Events />}></Route>
        <Route path="/plan-event" element={<PlanEvent />}></Route>
        <Route path="/account" element={<Login />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/favorites" element={<Favorites />}></Route>
        <Route path="/eventpage/:eventId" element={<Eventpage />}></Route>
        <Route path="/add-product" element={<Productpage />}></Route>
        <Route path="/checkout" element={<Checkout />}></Route>
        <Route path="/success" element={<Success />}></Route>
        <Route path="/cancel" element={<Cancel />}></Route>
        <Route path="/order-history" element={<OrderHistory />}></Route>
        <Route path="/product/:productId" element={<Productpages />}></Route>
        <Route path="/account-products" element={<AccountProducts />}></Route>
      </Routes>
    </div>
  );
}

export default Contents;
