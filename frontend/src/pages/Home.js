import Layout from "../components/Layout";
import "../stylesheets/home.css";
import "../stylesheets/global.css";
import plus from "../assets/imgs/plus.png";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ContentItem from "../components/ContentItem";
// import CapsuleList from "./CapsuleList";
// import CapsuleInfo from "./CapsuleInfo";

const Home = () => {
  const fileInputRef = useRef();

  const [showForm, setShowForm] = useState(false);

  const [showComponent, setShowComponent] = useState(true);

  const [startDate, setStartDate] = useState(new Date());

  const [selectedFiles, setSelectedFiles] = useState([]);

  function handleUploadContentClick() {
    fileInputRef.current.click();
  }

  function handleFileChange(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        console.log("Selected file:", file);
      } else {
        console.error("Unsupported file type:", file.type);
        return;
      }
    }

    setSelectedFiles([...selectedFiles, ...files]);

    event.target.value = null;
  }

  const removeFile = (indexToRemove) => {
    setSelectedFiles(
      selectedFiles.filter((_, index) => index !== indexToRemove)
    );
  };

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
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*,video/*"
        onChange={handleFileChange}
        multiple
      />
      {/* <CapsuleInfo />     */}
      {/* <CapsuleList /> */}
      <div id="mainAreaContainer">
        {showForm ? (
          <div id="formBoxWrapper">
            <div id="formBox">
              <div className="formInputBox" id="titleBox">
                <input type="text" placeholder="Title"></input>
              </div>
              <div className="formInputBox" id="dateBox">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="MMMM dd, yyyy"
                />{" "}
              </div>
              <div className="formInputBox" id="descBox">
                <textarea placeholder="Description"></textarea>
              </div>
              <div id="uploadContainer">
                <div>Upload Cover</div>
                <div onClick={handleUploadContentClick}>Upload Content</div>
                <div>Upload Note</div>
              </div>
              <div className="formInputBox" id="contentBox">
                <div id="contentWrap">
                  {selectedFiles.length > 0 && (
                    <div id="contentItemContainer">
                      {selectedFiles.map((file, index) => (
                        <ContentItem
                          index={index}
                          file={file}
                          removeFileFunc={removeFile}
                        />
                        // <li key={index} style={{listStyle: 'none', margin: "10px", width: "100px", height: "40px", objectFit: "cover"}}>
                        //   {file.type.startsWith("image/") && (
                        //     <img
                        //       src={URL.createObjectURL(file)}
                        //       alt={file.name}
                        //       style={{
                        //         maxWidth: 150,
                        //         maxHeight: 150,
                        //         marginRight: 10,
                        //       }}
                        //     />
                        //   )}
                        //   {file.type.startsWith("video/") && (
                        //     <video
                        //       src={URL.createObjectURL(file)}
                        //       alt={file.name}
                        //       //controls
                        //       style={{
                        //         maxWidth: 150,
                        //         maxHeight: 150,
                        //         marginRight: 10,
                        //       }}
                        //     />
                        //   )}
                        //   <button onClick={() => removeFile(index)}>
                        //     Remove
                        //   </button>
                        //   {file.name}
                        // </li>
                      ))}
                    </div>
                  )}
                  {selectedFiles.length == 0 && (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p>No content yet...</p>
                    </div>
                  )}
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
              <img src={plus} alt="plus" />
              <p>New</p>
              <div style={{ display: "flex" }}>
                {showComponent && <p>Time&nbsp;</p>}
                <p>Capsule</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
