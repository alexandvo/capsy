import "../stylesheets/login-signup.css";
import logoIcon from "../assets/imgs/time-capsule-icon.png";
import "../stylesheets/global.css"

const Signup = () => {
  return (
    <>
      <div className="mainContainer">
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
            <p>Forgot your password?</p>
          </div>
        </div>
      </div>
      <div className="signUpContainer">
        <p>Already have an account?</p>
        <p className="link">Log in</p>
      </div>
    </>
  );
};

export default Signup;
