import "../styles/PlanEvent.css";

function PlanEvent() {
  return <DesktopLayout />;
}

function DesktopLayout() {
  return (
    <>
      <div className="eventpage">
        <h1 className="eventtitle">Plan Event</h1>

        <div className="event">
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Date
            </label>
            <input
              type="date"
              className="form-control"
              id="exampleFormControlInput2"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Start Time
            </label>
            <input
              type="time"
              className="form-control"
              id="exampleFormControlInput2"
              placeholder="name@example.com"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              End Time
            </label>
            <input
              type="time"
              className="form-control"
              id="exampleFormControlInput2"
              placeholder="name@example.com"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Host
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput2"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Event Name
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput2"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput2"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
            ></textarea>
          </div>
          <div className="eventbtn">
            <div className="col-auto">
              <button type="submit" className="btn btn-primary mb-3">
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlanEvent;
