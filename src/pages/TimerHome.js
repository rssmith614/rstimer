import { React, useState } from "react";

import Timer from "../components/Timer/Timer"
import TimeList from "../components/TimeList/TimeList"

const TimerHome = () => {
  const [times, setTimes] = useState([]);

  function ao5(timeList) {
    if (timeList.length !== 5) return null;
    const sorted = timeList.slice().sort((a, b) => (a.time - b.time));
    const smallest = sorted[0];
    const largest = sorted[sorted.length-1];

    const median = timeList.filter(o => o !== smallest && o !== largest);

    return median.reduce((acc, curr) => acc + curr.time, 0) / 3;
  }

  function ao12(timeList) {
    if (timeList.length !== 12) return null;
    const sorted = timeList.slice().sort((a, b) => (a.time - b.time));
    const smallest = sorted[0];
    const largest = sorted[sorted.length-1];

    const median = timeList.filter(o => o !== smallest && o !== largest);

    return median.reduce((acc, curr) => acc + curr.time, 0) / 10;
  }

  function addTime(time) {
    const newId = times.length + 1;
    const partial = times.map(time => {
      return {id: time.id, time: time.time};
    });
    partial.push({id: newId, time: time});
    const lastFive = partial.sort((a, b) => (a.id - b.id)).slice(newId-5, newId);
    const lastTwelve = partial.sort((a, b) => (a.id - b.id)).slice(newId-12, newId);
    const newTime = {id: newId, time: time, ao5: ao5(lastFive), ao12: ao12(lastTwelve)}
    setTimes([...times, newTime]);
  }

  function removeTime(idx) {
    const newTimes = [...times];
    newTimes.splice(idx, 1);
    setTimes(newTimes);
  }

  return (
    <div class="position-relative vh-100">
      <div class="position-absolute h-100 p-3 overflow-scroll">
        <TimeList times={times}/>
      </div>
      <div class="position-absolute top-50 start-50 translate-middle">
        <Timer addTime={addTime} removeTime={removeTime}/>
      </div>
    </div>
  );
}

export default TimerHome;