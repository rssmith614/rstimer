import { React, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { onValue, ref, child, push, update, query, orderByChild, equalTo } from "firebase/database";

import { db } from "../services/db";
import { auth } from "../services/auth";

import Timer from "../components/Timer/Timer"
import TimeList from "../components/Utils/TimeList"
import Scramble from "../components/Utils/Scramble";
import Stats from "../components/Utils/Stats";
import ScrambleVis from "../components/Utils/ScrambleVis";

import { onAuthStateChanged } from "@firebase/auth";
import Settings from "../components/Utils/Settings";

const TimerHome = () => {
  const [times, setTimes] = useState([]);
  const [scramble, setScramble] = useState(makeScramble().join(' '));
  const [drawScramble, setDrawScramble] = useState(localStorage.getItem('drawScramble'));
  const [overlay, setOverlay] = useState("");
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-bs-theme'));

  const timeReferences = useRef({});

  const nav = useNavigate();

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const timesForUser = query(ref(db, "times"), orderByChild('user'), equalTo(auth.currentUser.uid))
    
        const onDataChange = (snapshot) => {
          const data = snapshot.val();
          if (snapshot.exists()) {
            Object.entries(data).map((entry) => {
              timeReferences.current[entry[1].id] = entry[0];
              return timeReferences.current[entry[1].id];
            })
            setTimes(Object.values(data));
          }
        };

        return onValue(timesForUser, onDataChange);
      } else {
        nav('/login')
        console.log("user is logged out");
      }
    })
  }, [nav])

  // thank you bjcarlson42 https://github.com/bjcarlson42
  function makeScramble() {
    var options = ["F", "F2", "F'", "R", "R2", "R'", "U", "U2", "U'", "B", "B2", "B'", "L", "L2", "L'", "D", "D2", "D'"]
    var numOptions = new Set([0, 1, 2, 3, 4, 5]) // 0 = F, 1 = R, 2 = U, 3 = B, 4 = L, 5 = D
    var scramble = []
    var scrambleMoves = []
    
    // this is different from bjcarlson42's algorithm
    scramble = []
    for (let i = 0; i < 20; i++) {
      // pick a random valid move option
      let candidate = Array.from(numOptions.values())[getRandomInt(numOptions.size)];
      scramble.push(candidate);
      // don't select the move next time around
      numOptions.delete(candidate);

      // this avoids cases like "R L R" by only letting L or R be selected again
      // once F, U, B, or D is selected
      switch (candidate) {
        case 0:
        case 3:
          numOptions.add(1); numOptions.add(2); numOptions.add(4); numOptions.add(5);
          break;
        case 1:
        case 4:
          numOptions.add(0); numOptions.add(2); numOptions.add(3); numOptions.add(5);
          break;
        case 2:
        case 5:
          numOptions.add(0); numOptions.add(1); numOptions.add(3); numOptions.add(4);
          break;
        default:
          break;
      }
    }

    // switch numbers to letters
    var move
    for (var i = 0; i < 20; i++) {
      switch (scramble[i]) {
        case 0:
          move = options[getRandomInt(3)] // 0,1,2
          scrambleMoves.push(move)
          break
        case 1:
          move = options[getRandomIntBetween(3, 6)] // 3,4,5
          scrambleMoves.push(move)
          break
        case 2:
          move = options[getRandomIntBetween(6, 9)] // 6,7,8
          scrambleMoves.push(move)
          break
        case 3:
          move = options[getRandomIntBetween(9, 12)] // 9,10,11
          scrambleMoves.push(move)
          break
        case 4:
          move = options[getRandomIntBetween(12, 15)] // 12,13,14
          scrambleMoves.push(move)
          break
        case 5:
          move = options[getRandomIntBetween(15, 18)] // 15,16,17
          scrambleMoves.push(move)
          break
        default:
          scrambleMoves.push('')
          break
      }
    } 
    return scrambleMoves;
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) // returns up to max - 1
  }

  function getRandomIntBetween(min, max) { // return a number from min to max - 1. Ex. 3, 9 returns 3 - 8
    return Math.floor(Math.random() * (max - min) + min)
  }

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
      user: auth.currentUser.uid,
      id: newId,
      time: time,
      scramble: scramble,
      ao5: ao5(lastFive),
      ao12: ao12(lastTwelve),
      date: new Date(Date.now()).toString()
    };
    setTimes([...times, newTime]);

    const newPostKey = push(child(ref(db), 'times')).key;

    const updates = {};
    updates['/times/' + newPostKey] = newTime;

    setScramble(makeScramble().join(' '));
    
    return update(ref(db), updates);
  }

  function removeTime(idx) {
    if (window.confirm(`Are you sure?\nDelete time #${idx}`) === false)
      return;
    // console.log('removing', idx);
    const newTimes = times.filter(time => time.id !== idx);
    newTimes.sort((a, b) => (a.id - b.id));
    // console.log(newTimes);

    const updates = {};
    updates[`/times/${timeReferences.current[idx]}`] = null;

    for (let i=idx-1; i<newTimes.length; i++) {
      const lastFive = newTimes.slice(i-4, i+1);
      const lastTwelve = newTimes.slice(i-11, i+1);
      
      newTimes[i].id -= 1;
      newTimes[i].ao5 = ao5(lastFive);
      newTimes[i].ao12 = ao12(lastTwelve);

      updates[`/times/${timeReferences.current[newTimes[i].id+1]}`] = newTimes[i];
    }

    setTimes(newTimes);

    return update(ref(db), updates)
  }

  return (
    <>
    <div className="d-flex justify-content-between vh-100">
      <div className="d-flex align-items-center flex-column">
        <div className="p-3 overflow-scroll">
          <TimeList times={times} removeTime={removeTime} setOverlay={setOverlay}/>
        </div>
        <div className="mt-auto p-3">
          <Stats times={times} removeTime={removeTime} setOverlay={setOverlay}/>
        </div>
        <div className="p-3 h1" style={{ cursor: 'pointer' }}
          data-bs-toggle="offcanvas" data-bs-target="#settingsOverlay">
          RSTimer
        </div>
        </div>
      <div className="d-flex justify-content-between flex-column">
        <div className="d-flex align-self-start">
          <Scramble scramble={scramble} updateScramble={ () => setScramble(makeScramble().join(' ')) } />
        </div>
        <div className="d-flex align-self-end" style={{ background: '#00000000' }}>
          <Timer addTime={addTime} removeTime={removeTime} theme={theme} />
        </div>
        <div className="d-flex align-self-end">
          {drawScramble === 'true' ? <ScrambleVis scramble={scramble} /> : <></>}
        </div>
      </div>
      
    </div>

    <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasRight" data-toggle="modal">
      {overlay}
    </div>

    <div id="settingsOverlay" className="offcanvas offcanvas-end" tabIndex={-1}>
      <Settings theme={theme} setTheme={setTheme} drawScramble={drawScramble} setDrawScramble={setDrawScramble} />
    </div>
    </>
  );
}

export default TimerHome;