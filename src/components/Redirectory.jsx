import { Link, useLocation } from "react-router-dom";
import "../styles/RedirectoryBar.css";

function Redirectory() {
  const location = useLocation();

  return (
    <nav className="redirectory">
      <div className="Rcontainer-fluid">
        <Link
          to="/events"
          className={`bg-white border-0 btn ${
            location.pathname === "/events" ? "active" : ""
          }`}
        >
          Events
        </Link>
        <Link
          to="/marketplace"
          className={`bg-white border-0 btn ${
            location.pathname === "/marketplace" ? "active" : ""
          }`}
        >
          Marketplace
        </Link>
        <Link
          to="/about-us"
          className={`bg-white border-0 btn ${
            location.pathname === "/about-us" ? "active" : ""
          }`}
        >
          About Us
        </Link>
        <Link
          to="/plan-event"
          className={`bg-white border-0 btn ${
            location.pathname === "/plan-event" ? "active" : ""
          }`}
        >
          Plan Event
        </Link>
      </div>
    </nav>
  );
}

export default Redirectory;
