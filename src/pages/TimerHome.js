import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { onValue, ref, child, push, update, query, orderByChild, equalTo } from "firebase/database";

import { db } from "../services/db";
import { auth } from "../services/auth";

import Timer from "../components/Timer/Timer"
import TimeList from "../components/TimeList/TimeList"
import Scramble from "../components/Scramble/Scramble";

import { onAuthStateChanged, signOut } from "@firebase/auth";

const TimerHome = () => {
  const [times, setTimes] = useState([]);
  const [scramble, setScramble] = useState("");

  const nav = useNavigate();
  
  const handleLogout = () => {               
    signOut(auth).then(() => {
      // Sign-out successful.
      nav("/login");
      console.log("Signed out successfully")
    }).catch((error) => {
      // An error happened.
    });
  }

  useEffect(() => {
    setScramble(makeScramble().join(' '));
    
    // thank you bjcarlson42 https://github.com/bjcarlson42
    function makeScramble() {
      var options = ["F", "F2", "F'", "R", "R2", "R'", "U", "U2", "U'", "B", "B2", "B'", "L", "L2", "L'", "D", "D2", "D'"]
      var numOptions = [0, 1, 2, 3, 4, 5] // 0 = F, 1 = R, 2 = U, 3 = B, 4 = L, 5 = D
      var scramble = []
      var scrambleMoves = []
      var bad = true
      
      while (bad) {
        scramble = []
        for (let i = 0; i < 20; i++) {
          scramble.push(numOptions[getRandomInt(6)])
        }
        // check if moves directly next to each other involve the same letter
        for (let i = 0; i < 20 - 1; i++) {
          if (scramble[i] === scramble[i + 1]) {
            bad = true
            break
          } else {
            bad = false
          }
        }
      }
      // console.log(scramble)
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
      console.log(scrambleMoves)   
      return scrambleMoves;
    }
  }, [times])
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const timesForUser = query(ref(db, "times"), orderByChild('user'), equalTo(auth.currentUser.uid))
    
        const onDataChange = (snapshot) => {
          const data = snapshot.val();
          if (snapshot.exists())
            setTimes(Object.values(data));
        };

        return onValue(timesForUser, onDataChange);
      } else {
        nav('/login')
        console.log("user is logged out");
      }
    })
  }, [nav])

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
    <div class="d-flex justify-content-between vh-100">
      <div className="d-flex align-items-start flex-column">
        <div class="p-3 overflow-scroll">
          <TimeList times={times}/>
        </div>
        <div className="mt-auto p-3 h1">
          RSTimer
        </div>
        </div>
      <div>
        <Scramble scramble={scramble}/>
      </div>
      <div class="position-absolute top-50 start-50 translate-middle" style={{ background: '#00000000' }}>
        <Timer addTime={addTime} removeTime={removeTime}/>
      </div>
      <div class="position-absolute bottom-0 end-0">
        <button onClick={handleLogout} className="btn btn-secondary m-2">Log Out</button>
      </div>
    </div>
  );
}

export default TimerHome;