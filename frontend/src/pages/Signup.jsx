import "../stylesheets/login-signup.css";
import logoIcon from "../assets/imgs/time-capsule-icon.png";
import "../stylesheets/global.css";
import { Link, Navigate } from "react-router-dom";
import { useRef, useState } from "react";
import openEye from "../assets/imgs/open-eye.png";
import closeEye from "../assets/imgs/close-eye.png";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import google from "../assets/imgs/google.png";

const Signup = () => {
  const linkRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();

  const { userLoggedIn } = useAuth();

  const [showingPassword, setShowingPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSignupSubmit = async () => {
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(emailRef.current.value, passRef.current.value);
      } catch (err) {
        const errorCode = err.code;
        setIsRegistering(false);
        if (errorCode === 'auth/invalid-email') {
          setErrorMessage("Invalid email address");
        }
        if (errorCode === 'auth/weak-password') {
          setErrorMessage("Password must be at least 6 characters");
        }
      }
    }
  }
  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      doSignInWithGoogle().catch((err) => {
        setIsRegistering(false);
      });
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/capsy/"} replace={true} />}
      <div className="mainContainer">
        <Link ref={linkRef} to="/login" style={{ display: "none" }} />
        <div className="centeredContainer">
          <img src={logoIcon} className="logo" alt="logo" />
          <div className="loginContainer">
            <h1>Sign up</h1>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div className="inputBox">
              {/* <h4>Email</h4> */}
              <input ref={emailRef} type="text" placeholder="Email"></input>
            </div>
            <div className="inputBox">
              {/* <h4>Password</h4> */}
              <div
                style={{ width: "100%", display: "flex", flexDirection: "row" }}
              >
                <input
                  type={showingPassword ? "text" : "password"}
                  ref={passRef}
                  className="password"
                  placeholder="Password"
                ></input>
                <div
                  onClick={() => {
                    setShowingPassword(!showingPassword);
                  }}
                  style={{
                    width: "10%",
                    height: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    style={{
                      position: "absolute",
                      opacity: "50%",
                      width: "30px",
                      cursor: "pointer",
                    }}
                    src={showingPassword ? closeEye : openEye}
                    alt="password visibility icon"
                  />
                </div>
              </div>
            </div>
            <div onClick={onSignupSubmit} className="loginButt">
              <div>Sign up</div>
            </div>
            <div className="authDivider">
              <div
                style={{
                  flex: "1",
                  backgroundColor: "lightgray",
                  height: "2px",
                }}
              ></div>
              <p style={{ color: "gray", margin: "20px" }}>or</p>
              <div
                style={{
                  flex: "1",
                  backgroundColor: "lightgray",
                  height: "2px",
                }}
              ></div>
            </div>
            <div onClick={onGoogleSignIn} className="googleButt">
              <img className="googleIcon" src={google} alt="google logo" />
              <div style={{ color: "black" }}>Continue with Google</div>
            </div>
          </div>
        </div>
      </div>
      <div className="signUpContainer">
        <p>Already have an account?</p>
        <p
          className="link"
          style={{ marginLeft: "5px" }}
          onClick={() => {
            linkRef.current.click();
          }}
        >
          Log in
        </p>
        {/* <Link to="/login" style={{ color: "black" }}>
          <p className="link">Log in</p>
        </Link> */}
      </div>
    </>
  );
};

export default Signup;
