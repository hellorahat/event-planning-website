import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase.js"; // Make sure to configure Firebase
import "../styles/Events.css"; // Make sure to create styles for the event cards

function EventsList() {
  const [events, setEvents] = useState([]);

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(firestore, "events"));
      const eventData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventData);
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-list-container">
      <h1>Upcoming Events</h1>
      <div className="events-list">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const handleRegisterClick = () => {
    alert(`You have registered for ${event.name}`);
    // You can add actual registration logic here
  };

  return (
    <div className="event-card">
      <h3 className="event-title">{event.name}</h3>
      <p className="event-description">{event.description}</p>
      <p className="event-date">
        <strong>Date:</strong> {event.date}
      </p>
      <p className="event-time">
        <strong>Time:</strong> {event.timeStart} - {event.timeEnd}
      </p>
      <p className="event-host">
        <strong>Host:</strong> {event.host}
      </p>
      <p className="event-location">
        <strong>Location:</strong> {event.address}
      </p>
      <button className="register-button" onClick={handleRegisterClick}>
        Register
      </button>
    </div>
  );
}

export default EventsList;
