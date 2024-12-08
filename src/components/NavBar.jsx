import { useState } from "react";
import { Link } from "react-router-dom";
// import { UserProvider } from "../utility/UserContext";
import AccountMenu from "../components/AccountMenu"
// import { UserProvider } from "../utility/UserContext";
import logo from "../assets/Logo.svg";
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
    <nav class="navbar navbar-expand-lg navbar-light bg-success">
    <div class="container-fluid">
      <Link to="//" className="navbar-brand">
        <img src={logo} alt="Logo" width="150" height="20" />
      </Link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <span class = "nav-item">
            <Link
              to="/events"
              id="main-nav-button"
              className="nav-link"
            >
              <p>Events</p>
            </Link>
          </span>
          <span class = "nav-item">
            <Link
              to="/marketplace"
              id="main-nav-button"
              className="nav-link"
            >
              <p>Marketplace</p>
            </Link>
          </span>
          <span class = "nav-item">
            <Link
              to="/about-us"
              id="main-nav-button"
              className="nav-link"
            >
              <p>About Us</p>
            </Link>
          </span>
          <span class = "nav-item">
            <Link
              to="/plan-event"
              id="main-nav-button"
              className="nav-link"
            >
              <p>Plan Event</p>
            </Link>
          </span>
          <span class="nav-item">
            <p className="nav-link" href="#">Log In</p>
          </span>
        </ul>
      </div>
    </div>
  </nav>
  )
}

export default NavBar;
