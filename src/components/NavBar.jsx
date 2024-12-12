import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo.svg";
import iconCart from "../assets/cart.svg";
import iconFavorite from "../assets/favorite.svg";
import iconAccount from "../assets/account.svg";
import iconSearch from "../assets/search.svg";
import "../styles/NavBar.css";

function NavBar() {
  return (
    <>
      <DesktopLayout />
    </>
  );
}

function DesktopLayout() {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const handleClickSearch = () => {
    setSearchVisible((prevState) => !prevState);
  };
  const renderSearchBar = () => {
    if (isSearchVisible)
      return (
        <form className="d-flex" role="search">
          <input
            className="form-control active"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
        </form>
      );
    else
      return (
        <form className="d-flex" role="search">
          <input
            className="form-control"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
        </form>
      );
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-primary bg-gradient fixed-top"
      style={{ marginTop: "30px", paddingTop: "10px", paddingBottom: "10px" }}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo" width="200" height="30" />
        </Link>
        <div className="d-flex ms-auto">
          {renderSearchBar()}
          <div className="nav-item">
            <img
              className="icon mt-1"
              src={iconSearch}
              alt="search"
              width="30"
              height="30"
              style={{ marginLeft: "30px" }}
              onClick={handleClickSearch}
            ></img>
          </div>
          <div className="nav-item">
            <Link to="/account" id="main-nav-button" className="nav-link">
              <img
                className="icon mt-1"
                src={iconAccount}
                alt="login"
                width="30"
                height="30"
                style={{ marginLeft: "30px" }}
              ></img>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/favorites" id="main-nav-button" className="nav-link">
              <img
                className="icon mt-1"
                src={iconFavorite}
                alt="favorites"
                width="30"
                height="30"
                style={{ marginLeft: "30px" }}
              ></img>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/cart" id="main-nav-button" className="nav-link">
              <img
                className="icon mt-1"
                src={iconCart}
                alt="cart"
                width="30"
                height="30"
                style={{ marginLeft: "30px", marginRight: "15px" }}
              ></img>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
