import { React, useEffect, useState } from "react";
import { onValue, ref, child, push, update, query, orderByChild, equalTo } from "firebase/database";

import { db } from "../services/db";

import Timer from "../components/Timer/Timer"
import TimeList from "../components/TimeList/TimeList"

const TimerHome = () => {
  const [times, setTimes] = useState([]);

  useEffect(() => {
    let uid=0
    const timesForUser = query(ref(db, "times"), orderByChild('user'), equalTo(uid))
    
    const onDataChange = (snapshot) => {
      const data = snapshot.val();
      setTimes(Object.values(data));
    };

    return onValue(timesForUser, onDataChange);

  }, [])

  function ao5(timeList) {
    if (timeList.length !== 5) return '';
    const sorted = timeList.slice().sort((a, b) => (a.time - b.time));
    const smallest = sorted[0];
    const largest = sorted[sorted.length-1];

    const median = timeList.filter(o => o !== smallest && o !== largest);

    return median.reduce((acc, curr) => acc + curr.time, 0) / 3;
  }

  function ao12(timeList) {
    if (timeList.length !== 12) return '';
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
    const newTime = {
      user: 0,
      id: newId,
      time: time,
      ao5: ao5(lastFive),
      ao12: ao12(lastTwelve)
    };
    console.log(newTime);
    setTimes([...times, newTime]);

    const newPostKey = push(child(ref(db), 'times')).key;

    const updates = {};
    updates['/times/' + newPostKey] = newTime;
    
    return update(ref(db), updates);
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
      <div class="position-absolute top-50 start-50 translate-middle" style={{ background: '#00000000' }}>
        <Timer addTime={addTime} removeTime={removeTime}/>
      </div>
    </div>
  );
}

export default TimerHome;