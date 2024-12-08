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
        <h1>EVENTFLOW</h1>
        <div className="carousel">
          <Carousel data-bs-theme="dark">
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={carouselevent1}
                alt="First slide"
              />
              <Carousel.Caption className="carousel-caption">
                EVENTFLOW
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={carouselevent2}
                alt="Second slide"
              />
              <Carousel.Caption className="carousel-caption">
                EVENTFLOW
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={carouselevent3}
                alt="Third slide"
              />
              <Carousel.Caption className="carousel-caption">
                EVENTFLOW
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>
    </>
  );
}

export default Home;
