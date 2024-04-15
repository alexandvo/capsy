import "../stylesheets/home.css";
import "../stylesheets/global.css";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ContentItem from "../components/ContentItem";
import axios from "axios";

import useWindowDimensions from "../useWindow";
import { getAuth } from "firebase/auth";

const CreateForm = ({ setShow, setRerender, rerender }) => {
  const fileInputRef = useRef();
  const coverInputRef = useRef();
  const titleRef = useRef();

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const { height, width } = useWindowDimensions();

  const [description, setDescription] = useState("");
  const [coverBeenSet, setCoverBeenSet] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showExpandedDesc, setShowExpandedDesc] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleCreateCapsule = async () => {
    if (!titleRef.current.value || !date || !selectedFiles || !coverBeenSet) {
      window.alert('Capsule must have at least a title, cover, content, and date');
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", titleRef.current.value);
      formData.append("notes", description);
      formData.append("opendate", date);
      selectedFiles.forEach((item) => {
        formData.append("content", item.rawFile);
      });

      currentUser.getIdToken(true).then(async (idToken) => {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/capsules",
          formData,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "multipart/form-data; boundary=l3iPy71otz",
            },
          }
        );
        setLoading(false);
        titleRef.current.value = '';
        setDescription('');
        setDate(new Date());
        setSelectedFiles([]);
        
      }).catch((e) => {
        setLoading(false);
        console.error(e.message);
      }) 
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
    
  };

  const expandDesc = () => {
    setShowExpandedDesc(true);
  };
  const minimizeDesc = () => {
    
    setShowExpandedDesc(false);
  };
  const handleDescChange = (event) => {
    setDescription(event.target.value);
  };

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
  return (
    <>
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
      <div id="mainAreaContainer">
        <div id="formBoxWrapper">
          <div id="formBox">
            <div className="formInputBox" id="titleBox">
              <input type="text" ref={titleRef} placeholder="Title"></input>
            </div>
            <div className="formInputBox" id="dateBox">
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="MMMM dd, yyyy"
              />
            </div>
            <div
              className="formInputBox"
              id="descBox"
              onClick={() => {
                if (width < 1000) {
                  expandDesc();
                }
              }}
            >
              {width >= 1000 ? (
                <textarea
                  placeholder="Notes"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                ></textarea>
              ) : (
                <textarea
                  placeholder="Notes"
                  value={description ? description : ""}
                  readOnly
                ></textarea>
              )}
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
            <div id="createButton" onClick={handleCreateCapsule}>
              <h1>Create Time Capsule</h1>
            </div>
            <div
              id="minButton"
              style={{ right: "8px", top: "8px" }}
              onClick={() => {
                setRerender(!rerender);
                setShow(false);
              }}
            >
              <div className="crossPiece"></div>
              <div className="crossPiece"></div>
            </div>
            {showExpandedDesc && (
              <textarea
                id="eDesc"
                placeholder="Type notes here..."
                ref={expendedDescRef}
                value={description ? description : ""}
                onChange={handleDescChange}
              ></textarea>
            )}
          </div>
          {showExpandedDesc && (
            <div id="descMinButton" onClick={minimizeDesc}>
              <div style={{ width: "100%", height: "100%" }}>
                <div className="checkPiece"></div>
                <div className="checkPiece"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      {loading && (<div
        style={{display:"flex", justifyContent:"center", alignItems: "center", width: "100%", height: "100%" ,position: 'absolute', bottom: 0}}
      >
        <div style={{backgroundColor: "black", opacity: '10%', width: "100%", height: "100%" ,position: 'absolute'}}></div>
        <div style={{borderRadius: '100px', backgroundColor: "white", width: "120px", height: "40px" ,position: 'absolute'}}></div>
        <p style={{fontSize: '15px', textAlign: 'center', position: 'absolute'}}>Creating...</p>
      </div>)}
      
    </>
  );
};

export default CreateForm;
