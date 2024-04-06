import "../stylesheets/login-signup.css";
import logoIcon from "../assets/imgs/time-capsule-icon.png";
import "../stylesheets/global.css";
import { Link } from "react-router-dom";
import { useRef } from "react";

const Signup = () => {
  const linkRef = useRef();
  return (
    <>
      <div className="mainContainer">
      <Link ref={linkRef} to="/login" style={{display: "none"}}/>
        <div className="centeredContainer">
          <img src={logoIcon} className="logo" />
          <div className="loginContainer">
            <h1>Sign up</h1>
            <div className="inputBox">
              <h4>Email</h4>
              <input type="text" placeholder="Enter your email..."></input>
            </div>
            <div className="inputBox">
              <h4>Password</h4>
              <input type="text" placeholder="Enter your password..."></input>
            </div>
            <div className="loginButt">
              <div>Sign up</div>
            </div>
          </div>
        </div>
      </div>
      <div className="signUpContainer">
        <p>Already have an account?</p>
        <p className="link" style={{marginLeft: "5px"}} onClick={() => {linkRef.current.click()}}>Log in</p>
        {/* <Link to="/login" style={{ color: "black" }}>
          <p className="link">Log in</p>
        </Link> */}
      </div>
    </>
  );
};

export default Signup;
