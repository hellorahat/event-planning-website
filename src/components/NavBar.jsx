import { useState } from "react";
import { Link } from "react-router-dom";
// import { UserProvider } from "../utility/UserContext";
import AccountMenu from "../components/AccountMenu"
// import { UserProvider } from "../utility/UserContext";
import logo from "../assets/Logo.svg";
import cartIcon from "../assets/cart.svg"
import "../styles/NavBar.css";

function NavBar() {
  return (
    <>
      <DesktopLayout />
    </>
  );
}

function DesktopLayout() {
  const [isAccountVisible, setAccountVisible] = useState(false);
  const handleClickLogin = () => {
    setAccountVisible((prevState) => !prevState);
  }
  const renderAccountMenu = () => {
    return (
      isAccountVisible && (
        <AccountMenu />
      )
    )
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary bg-gradient fixed-top"
         style={{marginTop:"30px"}}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo" width="200" height="30" />
        </Link>
        <div className="d-flex ms-auto">
          <div className="nav-item">
            <Link to="/events" id="main-nav-button" className="nav-link">
              <p className="mt-4"
                style={{ marginLeft: "75px" }}
              >Events</p>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/marketplace" id="main-nav-button" className="nav-link">
              <p className="mt-4"
                 style={{ marginLeft: "75px" }}
              >Marketplace</p>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/about-us" id="main-nav-button" className="nav-link">
              <p className="mt-4"
                 style={{ marginLeft: "75px" }}
              >About Us</p>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/plan-event" id="main-nav-button" className="nav-link">
              <p className="mt-4"
                 style={{ marginLeft: "75px" }}
              >Plan Event</p>
            </Link>
          </div>
          <div className="nav-item">
            <p className="nav-link mt-4" id="main-nav-button"
               style={{ marginLeft: "75px" }}
            >Log In</p>
          </div>
          <div className="nav-item">
            <Link to="/cart" id="main-nav-button" className="nav-link">
              <img className="cartIcon mt-4" src={cartIcon} alt="cart" width="35" height="35"
                 style={{ marginLeft: "60px", marginRight: "30px"}}></img>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;
