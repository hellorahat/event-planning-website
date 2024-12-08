import { useState } from "react";
import { Link } from "react-router-dom";
// import { UserProvider } from "../utility/UserContext";
import AccountMenu from "../components/AccountMenu"
// import { UserProvider } from "../utility/UserContext";
import logo from "../assets/Logo.svg";
import iconCart from "../assets/cart.svg"
import iconFavorite from "../assets/favorite.svg"
import iconAccount from "../assets/account.svg"
import iconSearch from "../assets/search.svg"
import "../styles/NavBar.css";

function NavBar() {
  return (
    <>
      <DesktopLayout />
    </>
  );
}

function DesktopLayout() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary bg-gradient fixed-top"
         style={{marginTop:"30px", paddingTop:"10px", paddingBottom:"10px"}}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo" width="200" height="30" />
        </Link>
        <div className="d-flex ms-auto">
          <div className="nav-item">
            <Link to="/cart" id="main-nav-button" className="nav-link">
              <img className="icon mt-1" src={iconSearch} alt="cart" width="30" height="30"
                 style={{ marginLeft: "30px"}}></img>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/cart" id="main-nav-button" className="nav-link">
              <img className="icon mt-1" src={iconAccount} alt="cart" width="30" height="30"
                 style={{ marginLeft: "30px"}}></img>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/cart" id="main-nav-button" className="nav-link">
              <img className="icon mt-1" src={iconFavorite} alt="cart" width="30" height="30"
                 style={{ marginLeft: "30px"}}></img>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/cart" id="main-nav-button" className="nav-link">
              <img className="icon mt-1" src={iconCart} alt="cart" width="30" height="30"
                 style={{ marginLeft: "30px", marginRight: "15px"}}></img>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;
