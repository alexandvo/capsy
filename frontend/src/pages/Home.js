import Layout from "../components/Layout";
import "../stylesheets/home.css";
import "../stylesheets/global.css";
import plus from "../assets/imgs/plus.png";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ContentItem from "../components/ContentItem";
import { Link } from "react-router-dom";

// import CapsuleList from "./CapsuleList";
// import CapsuleInfo from "./CapsuleInfo";

const Home = () => {
  const fileInputRef = useRef();
  const coverInputRef = useRef();

  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [coverBeenSet, setCoverBeenSet] = useState(false);
  const [showComponent, setShowComponent] = useState(true);
  const [date, setDate] = useState(new Date());
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showExpandedDesc, setShowExpandedDesc] = useState(false);
  const expendedDescRef = useRef();

  function handleUploadContentClick() {
    fileInputRef.current.click();
  }

  function handleCoverClick() {
    if (!coverBeenSet) {
      coverInputRef.current.click();
    } else {
      window.alert("Only one cover image may be used.");
    }
  }

  const expandDesc = () => {
    
    setShowExpandedDesc(true);
  };
  const minimizeDesc = () => {
    setShowExpandedDesc(false);
  };
  const handleDescChange = (event) => {
    setDescription(event.target.value);
  }

  const handleFileChange = (event) => {
    const files = event.target.files;

    let fileObjList = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const fileObj = {
          rawFile: file,
          isCover: false,
        };
        fileObjList = [...fileObjList, fileObj];
      } else {
        window.alert(
          "Unsupported file type: " +
            file.type +
            "\nPlease choose either an image or a video.",
          file.type
        );
        event.target.value = null;
        return;
      }
    }

    event.target.value = null;

    setSelectedFiles([...selectedFiles, ...fileObjList]);
  };

  const removeFile = (indexToRemove, isCover) => {
    if (isCover) {
      setCoverBeenSet(false);
    }
    setSelectedFiles(
      selectedFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleCoverChange = (event) => {
    const coverFile = event.target.files[0];
    if (coverFile.type.startsWith("video/")) {
      window.alert(
        "Unsupported file type: " +
          coverFile.type +
          "\nPlease choose an image.",
        coverFile.type
      );
      event.target.value = null;
      return;
    }
    const fileObj = {
      rawFile: coverFile,
      isCover: true,
    };
    setCoverBeenSet(true);

    event.target.value = null;

    setSelectedFiles([fileObj, ...selectedFiles]);
  };

  useEffect(() => {
    if (showExpandedDesc) {
      expendedDescRef.current.focus();
    }
  }, [showExpandedDesc]);

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
      <input
        type="file"
        ref={coverInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleCoverChange}
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
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="MMMM dd, yyyy"
                />
              </div>
              <div className="formInputBox" id="descBox" onClick={expandDesc}>
                <textarea placeholder="Notes" value={description ? description : ""} readOnly>
                </textarea>
              </div>
              <div id="uploadContainer">
                <div id="coverButton" onClick={handleCoverClick}>
                  Upload Cover
                </div>
                <div onClick={handleUploadContentClick} id="contentButton">
                  Upload Content
                </div>
              </div>
              <div className="formInputBox" id="contentBox">
                <div id="contentWrap">
                  {selectedFiles.length > 0 && (
                    <div id="contentItemContainer">
                      {selectedFiles.map((fileObj, index) => (
                        <ContentItem
                          key={index}
                          index={index}
                          fileObj={fileObj}
                          removeFileFunc={removeFile}
                        />
                      ))}
                    </div>
                  )}
                  {selectedFiles.length === 0 && (
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

              {/* <div
                id="minButton"
                onClick={() => {
                  setShowForm(true);
                }}
              >
                <div className="crossPiece"></div>
                <div className="crossPiece"></div>
              </div> */}
              {showExpandedDesc && <textarea id="eDesc" placeholder="Type notes here..." ref={expendedDescRef} value={description ? description : ""} onChange={handleDescChange}></textarea>}
            </div>
            {showExpandedDesc && (
              <div
                id="descMinButton"
                onClick={minimizeDesc}
                
              >
                <div style={{width: "100%", height: "100%"}}>
                  <div className="crossPiece"></div>
                <div className="crossPiece"></div>
                </div>
                
              </div>
            )}
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
