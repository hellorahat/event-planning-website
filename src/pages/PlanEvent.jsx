import { useState, useEffect } from "react";
import { useUser } from "../utility/UserContext"; // Adjust the path based on your project structure
import { firestore, auth, storage } from "../../firebase.js"; // Include storage
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage functions
import { useNavigate } from "react-router-dom";
import "../styles/PlanEvent.css";

function PlanEvent() {
  const { user, loading } = useUser(); // Get user from context
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    if (!loading && !user) {
      navigate("/account");
    }
  }, [user, loading, navigate]);

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    host: user ? user.name : "", // Autofill host name from context if available
    eventName: "",
    address: "",
    description: "",
    url: "",
    photo: "",
  });

  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  async function addEvent(e) {
    e.preventDefault();
    try {
      // Step 1: Upload the image if provided
      let imagePath = null; // This will hold the image path
      let imageUrl = null;
      if (image) {
        imagePath = `images/${image.name}`; // Define the storage path (you can modify this as needed)
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, image); // Upload the image
        imageUrl = await getDownloadURL(imageRef);
      }

      // Step 2: Add the event to the "events" collection
      const docRef = await addDoc(collection(firestore, "events"), {
        address: formData.address,
        date: formData.date,
        description: formData.description,
        name: formData.eventName,
        timeStart: formData.startTime,
        timeEnd: formData.endTime,
        host: formData.host,
        url: imagePath, // Store the image path in the "url" field
        photo: imageUrl,
      });
      console.log("Event created with ID: ", docRef.id);

      // Step 3: Update the "registered-events" collection
      const userId = auth.currentUser.uid;
      const registeredEventsRef = collection(firestore, "registered-events");
      const userDocRef = doc(registeredEventsRef, userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        await updateDoc(userDocRef, {
          eventIds: arrayUnion(docRef.id),
        });
      } else {
        await setDoc(userDocRef, {
          eventIds: [docRef.id],
        });
      }
      console.log("Event added to registered-events collection");

      // Step 4: Redirect to the events page
      navigate("/events"); // Redirect to the events page
    } catch (e) {
      console.error("Error adding event: ", e);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="eventpage">
      <h1 className="eventtitle">Plan Event</h1>
      <form onSubmit={addEvent} className="event">
        {/* Event input fields */}
        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="startTime" className="form-label">
            Start Time
          </label>
          <input
            type="time"
            className="form-control"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="endTime" className="form-label">
            End Time
          </label>
          <input
            type="time"
            className="form-control"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="host" className="form-label">
            Host
          </label>
          <input
            type="text"
            className="form-control"
            id="host"
            name="host"
            value={formData.host}
            onChange={handleInputChange}
            disabled
          />
        </div>

        <div className="mb-3">
          <label htmlFor="eventName" className="form-label">
            Event Name
          </label>
          <input
            type="text"
            className="form-control"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Upload Image
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="eventbtn">
          <div className="col-auto">
            <button type="submit" className="btn btn-primary mb-3">
              Create Event
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PlanEvent;
