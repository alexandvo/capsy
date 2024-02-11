import "../stylesheets/login-signup.css";
import logoIcon from "../assets/imgs/time-capsule-icon.png";
import "../stylesheets/global.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="mainContainer">
        <div className="centeredContainer">
          <img src={logoIcon} className="logo" />
          <div className="loginContainer">
            <h1>Log in</h1>
            <div className="inputBox">
              <h4>Email</h4>
              <input type="text" placeholder="Enter your email..."></input>
            </div>
            <div className="inputBox">
              <h4>Password</h4>
              <input type="text" placeholder="Enter your password..."></input>
            </div>
            <div className="loginButt">
              <div>Log in</div>
            </div>
            <p>Forgot your password?</p>
          </div>
        </div>
      </div>
      <div className="signUpContainer">
        <p>Don't have an account?</p>
        <Link to="/signup" style={{ color: "black" }}>
          <p className="link">Sign up</p>
        </Link>
      </div>
    </>
  );
};

export default Login;
