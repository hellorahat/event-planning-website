import React from "react";
import { Container, Card, Typography, Button, Avatar, Divider, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ztmy from "../assets/ztmy.jpg";
import "../styles/Eventpage.css";
function EventPage() {
    let addr = "Zepp+New+Taipei,+taipei,+taiwan";
    const mapsrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBAgyvoRzJxAHngkRMjpl5NlGY01Rtih0s&q=${addr}`;
  return (
  
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Event Header */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
        <Grid item xs={3}>
            <Avatar
              src="https://via.placeholder.com/150"
              alt="Event"
              sx={{ width: 120, height: 120 }}
            />
          </Grid>
        
          <Grid item xs={9}>
            <Typography variant="h4" gutterBottom>
              Event Title
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date:</strong> January 15, 2025 <br />
              <strong>Time:</strong> 6:00 PM - 9:00 PM <br />
              <strong>Location:</strong> Central Park, NYC
            </Typography>
            <Button variant="contained" color="primary" sx={{ mr: 2 }}>
              Join
            </Button>
            <Button variant="outlined" color="secondary">
              Share
            </Button>
          </Grid>

        
        </Grid>
      </Card>
        {/* About the Event */}
        <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          About the Event
        </Typography>
        <Typography variant="body1">
          Zutomayo concert!!
        </Typography>
      </Card>

      <Card sx={{ mb: 3,height:"450px"}}>
          <img  className="eventimg"
                src={ztmy}
              alt="Event"
              sx={{ width: 120, height: 120, }}
            />
         </Card>
      

      <Card sx={{ mb: 3,height: "450px"}}>  
     
              <iframe
                src= {mapsrc}
                width="100%"
                height="100%"
                //style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            
        </Card>
      {/* Comments/Posts Section */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Event Updates
        </Typography>
        <Divider sx={{ my: 2 }} />
        <TextField
          fullWidth
          placeholder="Write a post..."
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary">
          Post
        </Button>

        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" gutterBottom>
          <strong>John Doe:</strong> Looking forward to this event!
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Jane Smith:</strong> Is there parking available nearby?
        </Typography>
      </Card>
    </Container>
  );
}

export default EventPage;
