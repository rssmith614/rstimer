import { useState } from "react";

const TimeList = ({ times }) => {
  const [overlay, setOverlay] = useState(null);

  const selectTime = (timeIdx) => {
    let time = times.sort((a, b) => (a.id - b.id))[timeIdx-1];
    let summary = (
      <>
        <div className="offcanvas-header">
          <div className="offcanvas-title h2">
            Time Summary
          </div>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" />
        </div>
        <div className="offcanvas-body">
          <p>
            Time: {msToStr(time.time)}
          </p>
          <p>
            Date: {time.date}
          </p>
          <p>
            Scramble: {time.scramble}
          </p>
          <button className="btn btn-danger">
            Delete Time
          </button>
        </div>
      </>
    )
    setOverlay(summary);
  }

  function msToStr(milliseconds) {
    if (milliseconds === '') return "N/A";
    let mSeconds = Math.floor((milliseconds % 1000) );
    let seconds = Math.floor((milliseconds / 1000) % 60);
    let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    let str = ''
    if (minutes > 0) {
      str += minutes + ':';
      str += ((seconds < 10) ? '0' : '');
    }
    str += seconds + '.'
      + ((mSeconds < 100 ? '0' : '')) + ((mSeconds < 10 ? '0' : '')) + mSeconds;
    return str.slice(0, str.length-1);
  }

  function timeList() {
    return times.sort((a, b) => (b.id - a.id)).map((time) => {
      return (
        <tr key={time.id}>
          <td>
            <div
            data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
            style={{ cursor: 'pointer' }}
            onClick={() => selectTime(time.id)}>
              <strong>{ time.id }</strong>
            </div>
          </td>
          <td>{ msToStr(time.time) }</td>
          <td>{ msToStr(time.ao5) }</td>
          <td>{ msToStr(time.ao12) }</td>
        </tr>
      );
    });
  }

  return (
    <>
      <table className="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Time</th>
            <th>ao5</th>
            <th>ao12</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          { timeList() }
        </tbody>
      </table>

      <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasRight">
        {overlay}
      </div>
    </>
  );
}

export default TimeList;