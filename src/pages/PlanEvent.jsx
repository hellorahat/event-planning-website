import "../styles/PlanEvent.css";

function PlanEvent() {
  return <DesktopLayout />;
}

function DesktopLayout() {
  return (
    <>
      <h1>Plan Event</h1>

      <div>
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Date
          </label>
          <input
            type="date"
            class="form-control"
            id="exampleFormControlInput2"
          />
        </div>

        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Time
          </label>
          <input
            type="time"
            class="form-control"
            id="exampleFormControlInput2"
            placeholder="name@example.com"
          />
        </div>

        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Event Name
          </label>
          <input
            type="text"
            class="form-control"
            id="exampleFormControlInput2"
          />
        </div>

        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Address
          </label>
          <input
            type="text"
            class="form-control"
            id="exampleFormControlInput2"
          />
        </div>

        <div class="mb-3">
          <label for="exampleFormControlTextarea1" class="form-label">
            Description
          </label>
          <textarea
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="formFile" class="form-label">
            Default file input example
          </label>
          <input class="form-control" type="file" id="formFile" />
        </div>
        <div class="col-auto">
          <button type="submit" class="btn btn-primary mb-3">
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default PlanEvent;
