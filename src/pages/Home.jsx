import "../styles/Home.css";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import carouselevent1 from "../assets/carousel-event1.jpg";
import carouselevent2 from "../assets/carousel-event2.jpg";
import carouselevent3 from "../assets/carousel-event3.jpg";

function Home() {
  return <DesktopLayout />;
}

function DesktopLayout() {
  return (
    <>
      <div className="home_container">
        <div className="carousel">
          <Carousel fade data-bs-theme="dark">
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={carouselevent1}
                alt="First slide"
              />
              <Carousel.Caption className="carousel-text text-white d-flex flex-column">
                EVENTFLOW
              </Carousel.Caption>
              <Carousel.Caption>
                <Link className="carousel-button" to="/events">
                  Find Local Events
                </Link>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={carouselevent2}
                alt="Second slide"
              />
              <Carousel.Caption className="carousel-text text-white d-flex flex-column">
                EVENTFLOW
              </Carousel.Caption>
              <Carousel.Caption>
                <Link className="carousel-button" to="/events">
                  Find Local Events
                </Link>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={carouselevent3}
                alt="Third slide"
              />
              <Carousel.Caption className="carousel-text text-white d-flex flex-column">
                EVENTFLOW
              </Carousel.Caption>
              <Carousel.Caption>
                <Link className="carousel-button" to="/events">
                  Find Local Events
                </Link>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
        <br />
        <h2 className="caption1">Your Next Event, One Click Away</h2>
        <br />
        <h4 className="caption2">
          With EventFlow, discovering your next event is as easy as a click. Our
          platform lets you explore a wide variety of events, from community
          gatherings to corporate conferences. Whether you're looking to attend
          or get involved, EventFlow makes it effortless to find and join events
          that matter to you. Say goodbye to the hassle of searching, and hello
          to a world of opportunities at your fingertips.
        </h4>
      </div>
    </>
  );
}

export default Home;
