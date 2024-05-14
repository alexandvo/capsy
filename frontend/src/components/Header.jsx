import "../stylesheets/header.css";
import icon from "../assets/imgs/time-capsule-icon.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { doSignOut } from "../firebase/auth";
import { AuthProvider, useAuth } from "../contexts/authContext";
import { getAuth } from "firebase/auth";
import logoutIcon from "../assets/imgs/logout.png";
import plusButton from "../assets/imgs/plus-button.png";

const Header = () => {
  const auth = getAuth();
  const { showForm, setShowForm, rerender, setRerender } = useAuth();

  const navigate = useNavigate();

  const [headerTitle, setHeaderTitle] = useState("Capsy");
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
      {showForm && (
        <div
          style={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
          }}
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setRerender(!rerender);
            }
          }}
        ></div>
      )}{" "}
      <div
        style={{ cursor: "pointer" }}
        id="iconPicContainer"
        onClick={() => {
          navigate("/");
        }}
      >
        <img id="logoIcon" src={icon} alt="logo icon" />
        <h1 id="bigScreenTitle">{headerTitle}</h1>
      </div>
      <h1 id="smallScreenTitle">{headerTitle}</h1>
      <div id="plusButton">
        <img
          style={{ width: "50px", height: "auto", cursor: "pointer" }}
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setRerender(!rerender);
            }
          }}
          src={plusButton}
          alt="plus button"
          className={showForm ? "x" : "no_x"}
        />
      </div>
      <div
        id="profilePicContainer"
        onClick={() => {
          setShowDropdown(!showDropdown);
        }}
      >
        <img
          id="pfpCir"
          style={{ display: "block", width: "30px", height: "auto" }}
          src={logoutIcon}
          ref={profilePicRef}
          alt="logout"
          onClick={() => {
            doSignOut().then(() => {
              navigate("/login");
            });
          }}
        />
      </div>
      {/* {showDropdown && (
        <div id="dropdown" ref={dropdownRef}>
          <Link to="/settings" className="options">
            Settings
          </Link>
          <div
            onClick={() => {
              doSignOut().then(() => {
                navigate("/login");
              });
            }}
            className="options"
          >
            Logout
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Header;
