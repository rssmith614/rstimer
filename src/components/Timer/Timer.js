import React, { useEffect, useState } from "react";
// import SegmentDisplay from "./segment-display.js"

export default () => {
  const [time, setTime] = useState(0);
  const [timing, setTiming] = useState(false);

  window.setInterval(window.display.setValue(msToStr(time)), 100);

  useEffect(() => {
    let interval = null;

    if (timing) {
      interval = setInterval(() => {
        setTime((time) => time + 10)
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    }
  }, [timing]);

  // function handleChange(event) {
  //   setTime(event.target.value);
  // };
  
  // function animate() {
  //   if (timing) {
  //     delta = Date.now() - startTime;
  //     let mSeconds = Math.floor((delta % 1000) );
  //     let seconds = Math.floor((delta / 1000) % 60);
  //     let minutes = Math.floor((delta / (1000 * 60)) % 60);
  //     let str = ((minutes < 10) ? '0' : '') + minutes
  //       + ':' + ((seconds < 10) ? '0' : '') + seconds
  //       + '.' + ((delta < 100 ? '0' : '')) + mSeconds;
  //     setTime(str);
  //     console.log(str)
  //   }
  // }

  function msToStr(milliseconds) {
    let mSeconds = Math.floor((milliseconds % 1000) );
    let seconds = Math.floor((milliseconds / 1000) % 60);
    let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    let str = ((minutes < 10) ? '0' : '') + minutes
      + ':' + ((seconds < 10) ? '0' : '') + seconds
      + '.' + ((mSeconds < 100 ? '0' : '')) + mSeconds;
    return str;
  }

  // var interval = 10; // ms
  // var expected = Date.now() + interval;
  // // setTimeout(step, interval);
  // function step() {
  //   var dt = Date.now() - expected; // the drift (positive for overshooting)
  //   if (dt > interval) {
  //       // something really bad happened. Maybe the browser (tab) was inactive?
  //       // possibly special handling to avoid futile "catch up" run
  //   }
    

  //   expected += interval;
  //   setTimeout(step, Math.max(0, interval - dt)); // take into account drift
  // }

  function clear() {
    setTiming(false);
    setTime(0);
  }

  function start() {
    setTiming(true);
  }

  function pause() {
    setTiming(false);
  }


  // var display = new SegmentDisplay("display");
  // display.pattern         = "##:##.##";
  // display.displayAngle    = 0;
  // display.digitHeight     = 30.5;
  // display.digitWidth      = 17;
  // display.digitDistance   = 3.9;
  // display.segmentWidth    = 3.2;
  // display.segmentDistance = 0.2;
  // display.segmentCount    = 7;
  // display.cornerType      = 1;
  // display.colorOn         = "#ffffff";
  // display.colorOff        = "#3b3b3b";
  // display.draw();
  
  return (
    <>
      <canvas id="display" class="p-2 m-2" width="260" height="140" style={{ backgroundColor: 'rgb(36, 30, 30)' }}></canvas>
      {/* <input id='time' class="m-2" type='text' defaultValue={time} onKeyUp={handleChange} pattern="[0-9]{2}:[0-9]{2}\.[0-9]{2}"></input> */}
      <div>
        <button class="m-1" onClick={clear}>Clear</button>
        <button class="m-1" onClick={start}>Start</button>
        <button class="m-1" onClick={pause}>Pause</button>
      </div>
    </>
  );
}