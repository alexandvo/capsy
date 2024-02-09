import Layout from "../components/Layout";
import "../stylesheets/home.css";
import "../stylesheets/global.css";
import plus from "../assets/imgs/plus.png";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CapsuleList from "./CapsuleList";
import CapsuleInfo from "./CapsuleInfo";

const Home = () => {
  const [showForm, setShowForm] = useState(false);

  const [showComponent, setShowComponent] = useState(true);

  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    const handleResize = () => {
      // Update the state based on the viewport width
      setShowComponent(window.innerWidth > 850); // Adjust the threshold as needed
    };

    // Initial setup
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <Layout>  
      {/* <CapsuleInfo />     */}
      <CapsuleList />
      {/* <div id="mainAreaContainer">
        {showForm ? (
          <div id="formBoxWrapper">
            <div id="formBox">
              <div className="formInputBox" id="titleBox">
                <input type="text" placeholder="Title"></input>
              </div>
              <div className="formInputBox" id="dateBox">
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="MMMM dd, yyyy" />              </div>
              <div className="formInputBox" id="descBox">
                <textarea placeholder="Description"></textarea>
              </div>
              <div id="uploadContainer">
                <div>Upload Cover</div>
                <div>Upload Content</div>
                <div>Upload Note</div>
              </div>
              <div className="formInputBox" id="contentBox">
                <div id="contentWrap">
                  <p>No content yet...</p>
                </div>
              </div>
              <div id="createButton">
                <h1>Create Time Capsule</h1>
              </div>

              <div
                id="minButton"
                onClick={() => {
                  setShowForm(false);
                }}
              >
                <div className="crossPiece"></div>
                <div className="crossPiece"></div>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="box"
            onClick={() => {
              setShowForm(true);
            }}
          >
            <div id="middleContainer">
              <img src={plus} />
              <p>New</p>
              <div style={{ display: "flex" }}>
                {showComponent && <p>Time&nbsp;</p>}
                <p>Capsule</p>
              </div>
            </div>
          </div>
        )}
      </div> */}
    </Layout>
  );
};

export default Home;

