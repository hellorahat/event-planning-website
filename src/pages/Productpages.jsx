import { useMediaQuery } from "react-responsive";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import carouselevent1 from "../assets/carousel-event1.jpg";
import carouselevent2 from "../assets/carousel-event2.jpg";
import carouselevent3 from "../assets/carousel-event3.jpg";
import  "../styles/productpage.css";
function Productpages() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return <>{ <DesktopLayout />}</>;
}



function DesktopLayout() {

  return (
    <div>
   <Grid container spacing={0}>
  
  <Grid sx={{ pl: 5, mb: 3 }} size={8}>
  <Card sx={{ minWidth: 275 }}>
      
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
    </Card>
  </Grid>
  
  
  
  <Grid sx={{ px: 5, mb: 3 }} size={4}>
  <div className="description">
      <h2>hello</h2>
  

    <hr></hr>
      seller name
     
      <hr></hr>
      Condition: New
      <br/>
      
      <form>
  <div class="mb-3">

  <div class="mb-3 d-flex align-items-center">
    <label for="quantityin" class="form-label me-2">Quantity: </label>
    <input type="number" class="form-control" id="quantityin" />
    </div>
  </div>
 
  <button type="submit" class="btn btn-primary mb-2">Add to cart</button>
  <button type="submit" class="btn btn-primary">Add to favorites</button>
 
</form>

      <hr></hr>
      shipping info:<br/>
      Free shipping - Arrives by Christmas
Get it between Sat, Dec 14 and Fri, Dec 20 to 11373. See detailsfor shipping
Located in: Whitehall, Pennsylvania, United States
<hr></hr>    
  </div>

  </Grid>

<Grid sx={{ px: 5, mb: 3 }} size={12}>

      description:
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
</Grid>


</Grid>
    </div>
  );
}

export default Productpages;
