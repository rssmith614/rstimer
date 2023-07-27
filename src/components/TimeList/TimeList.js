import { useState } from "react";

const TimeList = ({ times, removeTime }) => {
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
          <button className="btn btn-danger" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" onClick={() => removeTime(time.id)}>
            Delete Time
          </button>
        </div>
      </>
    )
    setOverlay(summary);
  }

  const getAo5 = (idx) => {
    const lastFive = times.sort((a, b) => (a.id - b.id)).slice(idx-5, idx);

    const sorted = lastFive.slice().sort((a, b) => (a.time - b.time));
    const smallest = sorted[0];
    const largest = sorted[sorted.length-1];

    const median = lastFive.filter(o => o !== smallest && o !== largest);

    const ao5 = median.reduce((acc, curr) => acc + curr.time, 0) / 3;

    const timeList = [];

    lastFive.forEach(time => {
      if (time === smallest || time === largest) {
        timeList.push(
          <p
            data-bs-target="#offcanvasRight"
            style={{ cursor: 'pointer' }}
            onClick={() => selectTime(time.id)}>
              <strong>{ time.id }:</strong>&nbsp;({msToStr(time.time)})
          </p>
        );
      } else {
        timeList.push(
          <p
            data-bs-target="#offcanvasRight"
            style={{ cursor: 'pointer' }}
            onClick={() => selectTime(time.id)}>
              <strong>{ time.id }:</strong>&nbsp;{msToStr(time.time)}
          </p>
        );
      }
    });

    timeList.reverse();

    let summary = (
      <>
      <div className="offcanvas-header">
        <div className="offcanvas-title h2">
          Average of 5 Summary: {msToStr(ao5)}
        </div>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" />
      </div>
      <div className="offcanvas-body">
        {timeList}
      </div>
      </>
    );

    setOverlay(summary);
  }
  
  const getAo12 = (idx) => {
    const lastTwelve = times.sort((a, b) => (a.id - b.id)).slice(idx-12, idx);

    const sorted = lastTwelve.slice().sort((a, b) => (a.time - b.time));
    const smallest = sorted[0];
    const largest = sorted[sorted.length-1];

    const median = lastTwelve.filter(o => o !== smallest && o !== largest);

    const ao12 = median.reduce((acc, curr) => acc + curr.time, 0) / 9;

    const timeList = [];

    lastTwelve.forEach(time => {
      if (time === smallest || time === largest) {
        timeList.push(
          <p
            data-bs-target="#offcanvasRight"
            style={{ cursor: 'pointer' }}
            onClick={() => selectTime(time.id)}>
              <strong>{ time.id }:</strong>&nbsp;({msToStr(time.time)})
          </p>
        );
      } else {
        timeList.push(
          <p
            data-bs-target="#offcanvasRight"
            style={{ cursor: 'pointer' }}
            onClick={() => selectTime(time.id)}>
              <strong>{ time.id }:</strong>&nbsp;{msToStr(time.time)}
          </p>
        );
      }
    });

    timeList.reverse();

    let summary = (
      <>
      <div className="offcanvas-header">
        <div className="offcanvas-title h2">
          Average of 12 Summary: {msToStr(ao12)}
        </div>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" />
      </div>
      <div className="offcanvas-body">
        {timeList}
      </div>
      </>
    );

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
          <td>
            <div
            data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
            style={{ cursor: 'pointer' }}
            onClick={() => getAo5(time.id)}>
              { msToStr(time.ao5) }
            </div>
          </td>
          <td>
            <div
            data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
            style={{ cursor: 'pointer' }}
            onClick={() => getAo12(time.id)}>
              { msToStr(time.ao12) }
            </div>
          </td>
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

      <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasRight" data-toggle="modal">
        {overlay}
      </div>
    </>
  );
}

export default TimeList;