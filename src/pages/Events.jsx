import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase.js";
import { getAuth } from "firebase/auth"; // To get the current user
import { useUser } from "../utility/UserContext.jsx";
import "../styles/Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  // Get the current user from Firebase Authentication
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(setUser); // Updates the user state
    return () => unsubscribe(); // Cleanup the listener
  }, []);

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

  const handleDelete = async (eventId) => {
    try {
      const eventDocRef = doc(firestore, "events", eventId);
      await deleteDoc(eventDocRef);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  return (
    <div className="events-list-container">
      <h1>Upcoming Events</h1>
      <div className="events-list">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            user={user}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event, user, onDelete }) {
  const handleRegisterClick = () => {
    alert(`You have registered for ${event.name}`);
  };

  const isHost = user && String(user.name) === event.host; // Check if current user is the host
  console.log("Current user uid:", user?.uid);
  console.log("Event host uid:", event.host);

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
      {isHost && (
        <button className="delete-button" onClick={() => onDelete(event.id)}>
          Delete Event
        </button>
      )}
    </div>
  );
}

export default Events;
