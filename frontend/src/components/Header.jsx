import "../stylesheets/header.css";
import icon from "../assets/imgs/time-capsule-icon.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { doSignOut } from "../firebase/auth";

const Header = () => {
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const profilePicRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        event.target !== profilePicRef.current
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className='rect'>
      <div id="iconPicContainer">
        <Link to="/">
          <img src={icon} alt="logo icon" />
        </Link>
      </div>

      <h1>Capsy</h1>
      <div
        id="profilePicContainer"
        onClick={() => {
          setShowDropdown(!showDropdown);
        }}
      >
        <div id="pfpCir" ref={profilePicRef}></div>
      </div>
      {showDropdown && (
        <div id="dropdown" ref={dropdownRef}>
          <Link to="/settings" className="options">Settings</Link>
          <div onClick={() => {doSignOut().then(() => { navigate('/login')})}} className="options">Logout</div>
        </div>
      )}
    </div>
  );
};

export default Header;
