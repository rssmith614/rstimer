import react, { useEffect, useState } from 'react';

import logo from './logo.svg';
import './App.css';

import Login from './pages/Login';
import TimerHome from './pages/TimerHome';

function App() {

  return (
    // <div className="App">
    //   {/* <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header> */}
    //   <Login />
    // </div>
    <div class="bg-dark">
      <TimerHome />
    </div>

    // <canvas id="display"></canvas>
  );
}

export default App;
