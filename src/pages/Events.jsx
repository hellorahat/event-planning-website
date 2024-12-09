import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase.js";
import { useUser } from "../utility/UserContext.jsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getStorage, ref, deleteObject } from "firebase/storage";
import "../styles/Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const { user } = useUser(); // Use the `useUser` hook to get the current user
  const [userRegisteredEvents, setUserRegisteredEvents] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(firestore, "events"));
      const eventData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // If the user is the host, automatically add the event to their registered events
      if (user) {
        const updatedEvents = eventData.map((event) => {
          if (event.host === user.name) {
            setUserRegisteredEvents((prev) => [...prev, event.id]); // Add host events to registered events
          }
          return event;
        });
        setEvents(updatedEvents);
      } else {
        setEvents(eventData);
      }
    };

    const fetchRegisteredEvents = async () => {
      if (user) {
        const userDocRef = doc(firestore, "registered-events", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          setUserRegisteredEvents(userDocSnapshot.data().eventIds || []);
        }
      }
    };

    fetchEvents();
    fetchRegisteredEvents();
  }, [user]);

  const handleRegister = async (eventId) => {
    if (!user) {
      alert("Please log in to register for an event.");
      navigate("/account"); // Redirect to the account/login page
      return;
    }

    try {
      const userDocRef = doc(firestore, "registered-events", user.uid);

      // Add the event to the user's registered-events document
      await setDoc(
        userDocRef,
        {
          eventIds: arrayUnion(eventId),
        },
        { merge: true }
      );

      setUserRegisteredEvents((prev) => [...prev, eventId]); // Update the UI
      alert(`You have registered for ${eventId}`);
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  const handleDelete = async (eventId, isHost, imagePath) => {
    if (isHost) {
      try {
        // Remove the eventId from the user's registered events
        const userDocRef = doc(firestore, "registered-events", user.uid);
        await updateDoc(userDocRef, {
          eventIds: arrayRemove(eventId),
        });

        // Delete the event document from 'events' collection
        const eventDocRef = doc(firestore, "events", eventId);
        await deleteDoc(eventDocRef);

        // Remove the eventId from all users who are registered for the event
        const registeredEventsSnapshot = await getDocs(
          collection(firestore, "registered-events")
        );
        registeredEventsSnapshot.forEach(async (userDoc) => {
          const userEventIds = userDoc.data().eventIds || [];
          if (userEventIds.includes(eventId)) {
            const userDocRef = doc(firestore, "registered-events", userDoc.id);
            await updateDoc(userDocRef, {
              eventIds: arrayRemove(eventId),
            });
          }
        });

        // Delete the image file from Firebase Storage (in the "images" folder)
        if (imagePath) {
          const storage = getStorage();
          const imageRef = ref(storage, imagePath); // Use the passed imagePath
          await deleteObject(imageRef);
          console.log("Image deleted from Firebase Storage.");
        } else {
          console.log("No image path found for deletion.");
        }

        // Update the events state
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );

        alert("Event deleted, and image removed from storage.");
      } catch (error) {
        console.error("Error deleting event and image:", error);
        alert("There was an error deleting the event and image.");
      }
    } else {
      try {
        // For non-hosts: Remove the eventId from the user's registered events
        const userDocRef = doc(firestore, "registered-events", user.uid);
        await updateDoc(userDocRef, {
          eventIds: arrayRemove(eventId),
        });

        setUserRegisteredEvents((prev) => prev.filter((id) => id !== eventId));
        alert("You have unregistered from this event.");
      } catch (error) {
        console.error("Error unregistering from event:", error);
      }
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
            onRegister={handleRegister}
            onDelete={handleDelete}
            isRegistered={userRegisteredEvents.includes(event.id)}
            imagePath={event.url}
          />
        ))}
      </div>

      {user && (
        <div className="registered-events-dropdown">
          <h2>Your Registered Events</h2>
          {userRegisteredEvents.length > 0 ? (
            <div className="registered-events-list">
              {userRegisteredEvents.map((eventId) => {
                const event = events.find((e) => e.id === eventId);
                return event ? (
                  <div className="dropdown-item" key={event.id}>
                    <button
                      className="unregister-button"
                      onClick={() =>
                        handleDelete(
                          event.id,
                          event.host === user.name,
                          event.url
                        )
                      }
                    >
                      &#10005; {/* "X" icon */}
                    </button>
                    <div className="event-info">
                      <h3 className="event-name">{event.name}</h3>
                      <p>
                        <strong>Address:</strong> {event.address}
                      </p>
                      <p>
                        <strong>Date:</strong> {event.date}
                      </p>
                      <p>
                        <strong>Time:</strong> {event.timeStart} -{" "}
                        {event.timeEnd}
                      </p>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p className="no-registered-events">
              You are not registered for any events yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function EventCard({ event, user, onRegister, onDelete, isRegistered }) {
  const handleRegisterClick = () => {
    if (!isRegistered && user && user.name !== event.host) {
      onRegister(event.id);
    } else if (user && user.name === event.host) {
      alert(`You are the host for ${event.name}. You are already registered.`);
    } else {
      alert(`You are already registered for ${event.name}`);
    }
  };

  const userName = user ? user.name : "";
  const isHost = userName === event.host; // Check if current user is the host

  return (
    <div className="event-card">
      {event.url && (
        <img
          src={event.photo} // Assuming event.photo contains the image URL
          alt={event.name}
          className="event-image"
        />
      )}
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
        {isHost
          ? "Already Registered"
          : isRegistered
          ? "Already Registered"
          : "Register"}
      </button>
      {isHost && (
        <button
          className="delete-button"
          onClick={() => onDelete(event.id, true, event.url)}
        >
          Delete Event
        </button>
      )}
    </div>
  );
}

export default Events;
