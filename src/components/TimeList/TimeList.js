const TimeList = ({ times }) => {

  function msToStr(milliseconds) {
    if (milliseconds === null) return "N/A";
    let mSeconds = Math.floor((milliseconds % 1000) );
    let seconds = Math.floor((milliseconds / 1000) % 60);
    let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    let str = ((minutes < 10) ? '0' : '') + minutes
      + ':' + ((seconds < 10) ? '0' : '') + seconds
      + '.' + ((mSeconds < 100 ? '0' : '')) + mSeconds;
    return str;
  }

  function timeList() {
    return times.sort((a, b) => (b.id - a.id)).map((time) => {
      return (
        <tr key={time.id}>
          <td><strong>{ time.id }</strong></td>
          <td>{ msToStr(time.time) }</td>
          <td>{ msToStr(time.ao5) }</td>
          <td>{ msToStr(time.ao12) }</td>
        </tr>
      );
    });
  }

  return (
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th></th>
          <th>Time</th>
          <th>ao5</th>
          <th>ao12</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        { timeList() }
      </tbody>
    </table>
  );
}

export default TimeList;