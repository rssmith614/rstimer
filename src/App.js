import './App.css';

import TimerHome from './pages/TimerHome';
import Login from './pages/Login';
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import Signup from './pages/Signup';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<TimerHome />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
