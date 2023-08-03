import { useNavigate } from "react-router";
import { signOut } from "@firebase/auth"

import { auth } from "../../services/auth";

const Settings = ({ theme, setTheme, drawScramble, setDrawScramble }) => {

  const nav = useNavigate();  
  
  const toggleTheme = () => {
    const newTheme = (theme === 'dark') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme);
  }

  const toggleDrawScramble = () => {
    const newState = (drawScramble === 'true') ? 'false' : 'true';
    localStorage.setItem('drawScramble', newState);
    setDrawScramble(newState);
  }

  const handleLogout = () => {               
    signOut(auth).then(() => {
      // Sign-out successful.
      nav("/login");
      console.log("Signed out successfully")
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <>
    <div className="offcanvas-header h1">
      RSTimer
    </div>
    <div className="offcanvas-body">
      <div className="d-flex flex-column">
        <div className="form-check form-switch d-flex align-items-center">
          <input className="form-check-input" id="darkModeCheck" type="checkbox"
            checked={(theme === 'dark') ? 1 : 0} onChange={toggleTheme} />
          <label className="form-check-label m-1 ps-2" for="darkModeCheck">Dark Mode</label>
        </div>
        <div className="form-check form-switch d-flex align-items-center">
          <input className="form-check-input" id="drawScrambleCheck" type="checkbox"
            checked={(drawScramble === 'true') ? 1 : 0} onChange={toggleDrawScramble} />
          <label className="form-check-label m-1 ps-2" for="drawScrambleCheck">Draw Scramble</label>
        </div>
      </div>
      
      <div className="position-absolute bottom-0 end-0">
        <button onClick={handleLogout} className="btn btn-secondary m-2" data-bs-dismiss="offcanvas">Log Out</button>
      </div>
    </div>
    </>
  );
}

export default Settings;