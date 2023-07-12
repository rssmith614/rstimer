import React, { useEffect, useState, useRef } from "react";
// import SegmentDisplay from "./segment-display.js"

export default () => {
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
      window.display.colorOn = '#ffffff';
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(displayInterval);
      document.removeEventListener("keydown", downHandler, false);
      document.removeEventListener("keyup", upHandler, false);
    }
  }, [timing, ready, spaceHeld]);

  function msToStr(milliseconds) {
    let mSeconds = Math.floor((milliseconds % 1000) );
    let seconds = Math.floor((milliseconds / 1000) % 60);
    let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    let str = ((minutes < 10) ? '0' : '') + minutes
      + ':' + ((seconds < 10) ? '0' : '') + seconds
      + '.' + ((mSeconds < 100 ? '0' : '')) + mSeconds;
    return str;
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

  function end() {
    setTiming(false);
    setReady(false);
  }

  function spacePressTimer() {
    timerRef.current = setTimeout(() => {
      setReady(true);
    }, 1000)
  }

  function downHandler(event) {
    if (event.key === " " && !spaceHeld) {
      setSpaceHeld(true);
      if (timing) end();
      else {
        spacePressTimer();
      }
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
  
  return (
    <>
      <canvas id="display" class="p-2 m-2" width="260" height="140" style={{ backgroundColor: 'rgb(36, 30, 30)' }} value={time}></canvas>
      <div>
        <button class="m-1" onClick={clear}>Clear</button>
        <button class="m-1" onClick={start}>Start</button>
        <button class="m-1" onClick={end}>Stop</button>
      </div>
    </>
  );
}