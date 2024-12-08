import { useMediaQuery } from "react-responsive";
import stats from "../assets/about-us.png";
import newImage from "../assets/newImage.jpg";
//import "../styles/AboutUs.css";
import BlurryImageLoader from "../components/BlurryImageLoader";

function AboutUs() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return <>{isMobile ? <MobileLayout /> : <DesktopLayout />}</>;
}

function MobileLayout() {
  return (
    <div>
      <h1>Mobile About Us</h1>
    </div>
  );
}

function DesktopLayout() {
  return (
    <div>
      <br />
      <br />
      <h1 className="who">Who We Are</h1>

      <div className="who">
      At EventFlow, we connect you to the heart of your community by making it easy to discover local events. From festivals to workshops and social gatherings, our platform helps you find events that match your interests and location. We’re here to help you engage, connect, and create unforgettable experiences—all with a few clicks
        <br />
        <br />
      </div>
      <div className="bannerBox">
        <img className="banner" src={stats} alt="About Us Banner" />
      </div>
      <br />
      <br />
      <h1 className="who">Our Collection</h1>

      <div className="who">
      EventFlow brings you a diverse range of community events, from local festivals and concerts to workshops, charity drives, and meetups. Whether you're looking to explore, learn, or connect, our platform offers something for everyone. With a wide variety of events to choose from, discovering the perfect experience has never been easier.
      </div>
      <br />
      <br />
      <div>
        <BlurryImageLoader src={newImage} alt="Vintage Watch" />
      </div>
    </div>
  );
}

export default AboutUs;
