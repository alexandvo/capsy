import "../stylesheets/header.css";
import icon from "../assets/imgs/time-capsule-icon.png";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Header = () => {
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
    <div className="rect">
      <div id="iconPicContainer">
        <Link to="/">
          <img src={icon} />
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
          <Link to="/capsules" className="options">Capsules</Link>
          <Link to="/settings" className="options">Settings</Link>
          <Link className="options">Logout</Link>
        </div>
      )}
    </div>
  );
};

export default Header;
