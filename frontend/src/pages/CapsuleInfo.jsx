import "../stylesheets/global.css";
import "../stylesheets/capsuleInfo.css";
import lock from "../assets/imgs/locked.png";
import del from "../assets/imgs/delete.png";
import Layout from "../components/Layout";
import {useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getDownloadURL, ref, listAll, getMetadata } from "firebase/storage";
import { fstorage } from "../firebase/firebase";
import { getAuth } from "firebase/auth";
import ResizingImage from "../components/ResizingImage";
import CreateForm from "../components/CreateForm";
import { useAuth } from "../contexts/authContext";

const CapsuleInfo = ({}) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const { showForm, setShowForm, rerender, setRerender } = useAuth();


  const [capTitle, setCapTitle] = useState("");
  const [capNotes, setCapNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [coverUrl, setCoverUrl] = useState();
  const [openDate, setOpenDate] = useState();
  const [capFileObjs, setCapFileObjs] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentDeleting, setContentDeleting] = useState(false);

  const [isWide, setIsWide] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const folderRef = ref(fstorage, `/capsules/${id}`);

function handleDownloadAll() {
    capFileObjs.forEach((url, index) => {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `image_${index}.jpg`); // Assign unique filename
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        })
        .catch(error => console.error('Error downloading image:', error));
    });
}

  async function handleDelete() {
    setContentDeleting(true);
    try {
      const idToken = await currentUser.getIdToken(true);
      await fetch(`https://capsy-backend.onrender.com/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    } catch (err) {
      console.error(err);
    }

    setContentDeleting(false);
    navigate("/");
  }

  async function handleOpenLock() {
    if (new Date() < openDate) {
      return;
    }
    try {
      setContentLoading(true);
      const idToken = await currentUser.getIdToken(true);
      await fetch(`https://capsy-backend.onrender.com/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    } catch (err) {
      console.error(err.message);
    }
    setRerender(!rerender);
  }

  async function getFiles() {
    const files = await listAll(folderRef);
    // Get download URLs and file types for all files in the folder
    const urls = await Promise.all(
      files.items.map(async (item) => {
        const url = await getDownloadURL(item);
        // const metadata = await getMetadata(item);
        // const contentType = metadata.contentType;
        // return { url, type: contentType };
        return url;
      })
    );

    setCapFileObjs(urls);
  }

  async function fetchCapsule() {
    try {
      const idToken = await currentUser.getIdToken(true);
      const capsuleRes = await fetch(`https://capsy-backend.onrender.com/capsules/${id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      let capsule;
      if (!capsuleRes.ok) {
        throw new Error("Network response was not ok");
      } else {
        capsule = await capsuleRes.json();
      }
      const { title, notes, openDate, creator_id, unlocked } = capsule;
      const imgRef = ref(fstorage, `covers/${id}`);
      const url = await getDownloadURL(imgRef);
      setCoverUrl(url);
      setCapTitle(title);
      setCapNotes(notes);
      setOpenDate(new Date(openDate));

      if (unlocked) {
        //show everything and render from firebase
        await getFiles();
        setOpened(true);
      }
    } catch (err) {
      console.error(err.message);
    }

    setLoading(false);
    setContentLoading(false);
  }

  const handleImageLoad = (event) => {
    const img = event.target;
    if (img.naturalWidth > img.naturalHeight) {
      setIsWide(true);
    } else {
      setIsWide(false);
    }
  };

  useEffect(() => {
    fetchCapsule();
  }, [rerender]);

  // Function to toggle the shaking animation
  const toggleShake = () => {
    // After a short delay, stop the shaking animation
    setTimeout(() => {}, 1000); // Adjust the duration of the animation as needed
  };

  // Effect to trigger the shaking animation at random intervals
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly decide whether to shake the image
      if (Math.random() > 0.5) {
        toggleShake();
      }
    }, 2000); // Adjust the interval between shakes as needed

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <Layout>
      {!loading && (
        <div id="mainContainer">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
            id="pfpWrap"
          >
            <img
              onLoad={handleImageLoad}
              style={{
                height: isWide ? "100%" : "auto",
                width: isWide ? "auto" : "100%",
              }}
              src={coverUrl}
              alt="capsule cover"
            />
          </div>
          <div id="buttonWrap">
            <img id="del" style={{cursor: 'pointer'}} src={del} alt="delete" onClick={handleDelete} />
          </div>

          <h1>{capTitle}</h1>
          {opened && (
            <div id="buttonWrap" style={{marginBottom: '0px'}}>
              <p style={{ cursor: "pointer" , backgroundColor: '#d275ff', color: 'white', borderRadius: '100px', padding: '3px', paddingLeft: '10px', paddingRight: '10px'}} onClick={handleDownloadAll}>Download All Images</p>
            </div>
          )}
          {opened && (
            <p
              style={{
                paddingLeft: "8vw",
                paddingRight: "8vw",
                marginBottom: "50px",
              }}
            >
              {capNotes}
            </p>
          )}
          {!opened && (
            <>
              <p id="status" style={{ margin: "20px" }}>
                {new Date() >= openDate ? "Unlockable Now!" : "Locked"}
              </p>
              <img
                id="lock"
                style={{ margin: "20px", cursor: 'pointer' }}
                src={lock}
                alt="lock"
                onClick={handleOpenLock}
                className={new Date() >= openDate ? "shake" : ""}
              />
            </>
          )}
          {opened && (
            <div id="unlockedContainer">
              {capFileObjs.map((file, index) => (
                <React.Fragment key={index}>
                  {/* {file.type.startsWith("image/") && (
                    // <img src={file.url} alt={`Image ${index}`} />
                    <ResizingImage
                      src={file.url}
                      alt="image file"
                      size={300}
                      type="image"
                    />
                  )} */}
                  <ResizingImage
                      src={file}
                      alt="image file"
                      size={300}
                      type="image"
                    />
                  {/* {file.type.startsWith("video/") && (
                    <ResizingImage
                    src={file.url}
                    alt="image file"
                    size={300}
                    type="video"
                  />
                  )} */}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
      {contentLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            position: "absolute",
            bottom: 0,
          }}
        >
          <div
            style={{
              backgroundColor: "black",
              opacity: "10%",
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          ></div>
          <div
            style={{
              borderRadius: "100px",
              backgroundColor: "white",
              width: "120px",
              height: "40px",
              position: "absolute",
            }}
          ></div>
          <p
            style={{
              fontSize: "15px",
              textAlign: "center",
              position: "absolute",
            }}
          >
            Opening...
          </p>
        </div>
      )}
      {contentDeleting && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            position: "absolute",
            bottom: 0,
          }}
        >
          <div
            style={{
              backgroundColor: "black",
              opacity: "10%",
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          ></div>
          <div
            style={{
              borderRadius: "100px",
              backgroundColor: "white",
              width: "120px",
              height: "40px",
              position: "absolute",
            }}
          ></div>
          <p
            style={{
              fontSize: "15px",
              textAlign: "center",
              position: "absolute",
            }}
          >
            Deleting...
          </p>
        </div>
        
      )}
      {showForm && (
        <CreateForm
          setShow={setShowForm}
        />
      )}
    </Layout>
  );
};

export default CapsuleInfo;

{
  /* <div style={{width: '100px', height: '100px', backgroundColor: 'red'}}></div> */
}
