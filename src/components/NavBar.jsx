import { useState } from "react";
import { Link } from "react-router-dom";
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
    return (
        <h1>Nav Bar</h1>
    )
}

export default NavBar;
