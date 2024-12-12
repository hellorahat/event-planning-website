import { useState, useEffect } from "react";
import { useAlerts } from "../utility/AlertContext.jsx";

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
import { useNavigate } from "react-router-dom";
import { getStorage, ref, deleteObject } from "firebase/storage";
import "../styles/Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const { addAlert } = useAlerts();
  const { user } = useUser();
  const [userRegisteredEvents, setUserRegisteredEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(firestore, "events"));
      const eventData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (user) {
        const updatedEvents = eventData.map((event) => {
          if (event.host === user.name) {
            setUserRegisteredEvents((prev) => [...prev, event.id]);
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

  const handleRegister = async (eventId, eventName) => {
    if (!user) {
      addAlert("Please log in to register for an event.");
      navigate("/account");
      return;
    }

    try {
      const userDocRef = doc(firestore, "registered-events", user.uid);

      await setDoc(
        userDocRef,
        {
          eventIds: arrayUnion(eventId),
        },
        { merge: true }
      );

      setUserRegisteredEvents((prev) => [...prev, eventId]);
      addAlert(`You have registered for ${eventName}`);
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  const handleDelete = async (eventId, isHost, imagePath) => {
    if (isHost) {
      try {
        const userDocRef = doc(firestore, "registered-events", user.uid);
        await updateDoc(userDocRef, {
          eventIds: arrayRemove(eventId),
        });

        const eventDocRef = doc(firestore, "events", eventId);
        await deleteDoc(eventDocRef);

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

        if (imagePath) {
          const storage = getStorage();
          const imageRef = ref(storage, imagePath);
          await deleteObject(imageRef);
          console.log("Image deleted from Firebase Storage.");
        } else {
          console.log("No image path found for deletion.");
        }

        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );

        addAlert("Event deleted, and image removed from storage.");
      } catch (error) {
        console.error("Error deleting event and image:", error);
        addAlert("There was an error deleting the event and image.");
      }
    } else {
      try {
        const userDocRef = doc(firestore, "registered-events", user.uid);
        await updateDoc(userDocRef, {
          eventIds: arrayRemove(eventId),
        });

        setUserRegisteredEvents((prev) => prev.filter((id) => id !== eventId));
        addAlert("You have unregistered from this event.");
      } catch (error) {
        console.error("Error unregistering from event:", error);
      }
    }
  };

  const handleCardClick = (eventId) => {
    navigate(`/eventpage/${eventId}`);
  };

  return (
    <div className="events-list-container">
      <h1 style={{ textAlign: "center" }}>Upcoming Events</h1>
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
            handleCardClick={handleCardClick}
          />
        ))}
      </div>

      {user && (
        <div className="registered-events-dropdown">
          <h2 style={{ textAlign: "center" }}>Your Registered Events</h2>
          {userRegisteredEvents.length > 0 ? (
            <div className="registered-events-list">
              {userRegisteredEvents.map((eventId) => {
                const event = events.find((e) => e.id === eventId);
                return event ? (
                  <div className="dropdown-item" key={event.id}>
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
                      Unregister{" "}
                    </button>
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

function EventCard({
  event,
  user,
  onRegister,
  onDelete,
  isRegistered,
  handleCardClick,
}) {
  const handleRegisterClick = () => {
    if (!isRegistered && user && user.name !== event.host) {
      onRegister(event.id, event.name);
    } else if (user && user.name === event.host) {
      addAlert(
        `You are the host for ${event.name}. You are already registered.`
      );
    } else {
      addAlert(`Please sign in to register for event.`);
    }
  };

  const userName = user ? user.name : "";
  const isHost = userName === event.host;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(event.id, true, event.url);
  };

  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 15) {
      return words.slice(0, 15).join(" ") + " ...";
    }
    return description;
  };

  const truncateaddr = (description) => {
    const words = description.split(" ");
    if (words.length > 5) {
      return words.slice(0, 4).join(" ") + " ...";
    }
    return description;
  };

  return (
    <div className="event-card">
      <div
        onClick={() => handleCardClick(event.id)}
        style={{ cursor: "pointer" }}
      >
        {event.url && (
          <img src={event.photo} alt={event.name} className="event-image" />
        )}
        <h3 className="event-title">{event.name}</h3>
        <p className="event-description">
          {truncateDescription(event.description)}
        </p>
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
          <strong>Location:</strong> {truncateaddr(event.address)}
        </p>
      </div>
      <div className="placeholder-space"></div>
      <div className="events-buttons">
        <button className="register-button" onClick={handleRegisterClick}>
          {isHost
            ? "Already Registered"
            : isRegistered
            ? "Already Registered"
            : "Register"}
        </button>
        {isHost && (
          <button className="delete-event-button" onClick={handleDeleteClick}>
            Delete Event
          </button>
        )}
      </div>
    </div>
  );
}

export default Events;
