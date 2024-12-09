import { useState, useEffect } from "react";
import { useUser } from "../utility/UserContext"; // Adjust the path based on your project structure
import { firestore, auth } from "../../firebase.js"; // Import your Firestore instance
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/PlanEvent.css";

function PlanEvent() {
  const { user, loading } = useUser(); // Get user from context
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Redirect to account menu if the user is not signed in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/account"); // Adjust the path to your account menu
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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Add document to Firestore
  async function addEvent(e) {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(firestore, "events"), {
        address: formData.address,
        date: formData.date,
        description: formData.description,
        name: formData.eventName,
        timeStart: formData.startTime,
        timeEnd: formData.endTime,
        host: formData.host,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="eventpage">
      <h1 className="eventtitle">Plan Event</h1>
      <form onSubmit={addEvent} className="event">
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
            disabled // Disable editing host since it's autofilled
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
