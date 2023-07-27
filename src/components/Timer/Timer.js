import React, { useEffect, useState, useRef } from "react";
// import SegmentDisplay from "./segment-display.js"

const Timer = ({ addTime }) => {
  const [time, setTime] = useState(0);
  const [timing, setTiming] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [ready, setReady] = useState(false);

  const timeRef = useRef(0);
  const timerRef = useRef();

  useEffect(() => {
    let timerInterval = null;
    let displayInterval = null;

    displayInterval = setInterval(() => {
      window.display.setValue(msToStr(timeRef.current));
    }, 10);

    document.addEventListener("keydown", downHandler, false);
    document.addEventListener("keyup", upHandler, false);

    function end() {
      setTiming(false);
      setReady(false);
  
      addTime(timeRef.current);
    }
    
    function downHandler(event) {
      if (event.key === " " && !spaceHeld) {
        setSpaceHeld(true);
        if (timing) end();
        else {
          spacePressTimer();
        }
      } else if (event.key === "Escape") {
        clear();
      }
    }
  
    function upHandler(event) {
      if (event.key === " ") {
        setSpaceHeld(false);
        clearTimeout(timerRef.current);
        if (ready && !timing) {
          start();
        }
      }
    }

    if (timing) {
      timerInterval = setInterval(() => {
        timeRef.current = Date.now() - startTime;
        setTime(timeRef.current);
      }, 10);
    } else {
      clearInterval(timerInterval);
    }

    if (ready && spaceHeld) {
      window.display.colorOn = '#00ff00';
    } else if (!ready && spaceHeld) {
      window.display.colorOn = '#ff0000';
    } else {
      let timerColor = getComputedStyle(document.documentElement).getPropertyValue('--bs-emphasis-color');
      window.display.colorOn = timerColor;
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(displayInterval);
      document.removeEventListener("keydown", downHandler, false);
      document.removeEventListener("keyup", upHandler, false);
    }
  }, [startTime, timing, ready, spaceHeld, addTime]);

  function msToStr(milliseconds) {
    let mSeconds = Math.floor((milliseconds % 1000) );
    let seconds = Math.floor((milliseconds / 1000) % 60);
    let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    let str = ''
    if (minutes > 0) {
      if (minutes < 9)
        str += ' ';
      str += minutes + ':';
      str += ((seconds < 10) ? '0' : '');
    } else {
      str += '   ';
      if (seconds < 10)
        str += ' ';
    }
    str += seconds + '.'
      + ((mSeconds < 100 ? '0' : '')) + ((mSeconds < 10 ? '0' : '')) + mSeconds;
    return str.slice(0, str.length-1);
  }

  function clear() {
    setTiming(false);
    timeRef.current = 0;
    setTime(timeRef.current);
    setReady(false);
  }

  function start() {
    setTiming(true);
    setStartTime(Date.now());
    setReady(false);
  }


  function spacePressTimer() {
    timerRef.current = setTimeout(() => {
      setReady(true);
    }, 100)
  }
  
  return (
      <canvas id="display" className="px-5 m-2" width="260" height="140" value={time}></canvas>
  );
}

export default Timer;