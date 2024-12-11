import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Marketplace from "../pages/Marketplace";
import AboutUs from "../pages/AboutUs";
import Login from "../pages/Login";
import Events from "../pages/Events";
import PlanEvent from "../pages/PlanEvent";
import Eventpage from "../pages/Eventpage";
import Cart from "../pages/cart";
import Favorites from "../pages/Favorites";
// import Cart from "../pages/Cart";
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
        {/* <Route path="/cart" element={<Cart />}></Route>
        <Route path="/product/:id" element={<Product />}></Route> */}
      </Routes>
    </div>
  );
}

export default Contents;
