import "../stylesheets/login-signup.css";
import "../stylesheets/global.css";
import { Link, Navigate } from "react-router-dom";
import { useRef, useState } from "react";
import { doPasswordReset } from "../../src/firebase/auth";
import { useAuth } from "../../src/contexts/authContext";

const ForgotPassword = () => {
  const { userLoggedIn } = useAuth();

  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const linkRef = useRef();
  const emailRef = useRef();

  const handleForgotPassword = async () => {
    try {
      if (emailRef.current.value) {
        await doPasswordReset(emailRef.current.value);
        setEmailSent(true);
      }
    } catch (err) {
        setErrorMessage('Invalid email address');
      setEmailSent(false);
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to="/capsy/" replace={true} />}
      <div className="mainContainer">
        <Link ref={linkRef} to="/login" style={{ display: "none" }} />
        <div
          className="centeredContainer"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="loginContainer">
            <h1>{emailSent ? "Email sent" : "Forgot password?"}</h1>
            <p style={{ marginBottom: "30px" }}>
              {emailSent
                ? "Check your inbox for password reset email. It may also be in your spam."
                : "Please enter your email address. You will receive a link to reset your password via email."}
            </p>
            {errorMessage && !emailSent && <p style={{ color: "red" }}>{errorMessage}</p>}
            {!emailSent && (
              <div className="inputBox">
                {/* <h4>Email</h4> */}
                <input ref={emailRef} type="text" placeholder="Email"></input>
              </div>
            )}

           {emailSent ? <div onClick={() => {linkRef.current.click()}} className="loginButt">
              <div>Return to Log in</div>
            </div>
:
            <div onClick={handleForgotPassword} className="loginButt">
              <div>Reset password</div>
            </div>}
          </div>
        </div>
      </div>
      {/* <div className="signUpContainer">
        <p>Return to</p>
        <p
          className="link"
          style={{ marginLeft: "5px" }}
          onClick={() => {
            linkRef.current.click();
          }}
        >
          Log in
        </p>
   
      </div> */}
    </>
  );
};

export default ForgotPassword;
