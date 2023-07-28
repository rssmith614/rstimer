const Stats = ({ times, removeTime, setOverlay }) => {

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

  const average = (times) => {
    return times.reduce((acc, curr) => acc + curr.time, 0) / times.length;
  };

  const best = (times) => {
    return times.reduce((acc, curr) => acc = (curr.time < acc.time ? curr : acc), {time: Infinity});
  };

  const bestAo5 = (times) => {
    return times.reduce((acc, curr) => acc = (((curr.ao5 < acc.ao5) && curr.ao5 !== '') ? curr : acc), {ao5: Infinity});
  };

  const bestAo12 = (times) => {
    return times.reduce((acc, curr) => acc = ((curr.ao12 < acc.ao12) && curr.ao12 !== '' ? curr : acc), {ao12: Infinity});
  };

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

  return (
    <div className="px-3 py-3 mt-3 card">
      <h3>Average: { msToStr(average(times)) }</h3>
        <div className="py-1"
          data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
          style={{ cursor: 'pointer' }}
          onClick={() => selectTime(best(times).id)}>
            PB Single: { msToStr(best(times).time) }
        </div>
        <div className="py-1"
          data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
          style={{ cursor: 'pointer' }}
          onClick={() => getAo5(bestAo5(times).id)}>
            PB ao5: { msToStr(bestAo5(times).ao5) }
        </div>
        <div className="py-1"
          data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
          style={{ cursor: 'pointer' }}
          onClick={() => getAo12(bestAo12(times).id)}>
            PB ao12: { msToStr(bestAo12(times).ao12) }
        </div>
    </div>
  );
};

export default Stats;