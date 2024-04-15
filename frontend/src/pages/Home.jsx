import Layout from "../components/Layout";
import "../stylesheets/home.css";
import "../stylesheets/global.css";

import React, { useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";

import CapsuleListItem from "../../src/components/CapsuleListItem";
import plusButton from "../assets/imgs/plus-button.png";
import CreateForm from "../components/CreateForm";
import { getAuth } from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import { fstorage } from "../firebase/firebase";

const Home = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [showForm, setShowForm] = useState(false);
  const [capsulesData, setCapsulesData] = useState([]);
  const [rerender, setRerender] = useState(false);

  const showIdToken = true;

  //show current user idtoken
  useEffect(() => {
    if (showIdToken) {
      currentUser.getIdToken(true).then((idToken) => {
        console.log(idToken);
      });
    }
  }, []);

  useEffect(() => {
    currentUser.getIdToken(true).then((idToken) => {
      fetch("http://localhost:5000/capsules", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          Promise.all(
            data.map(async (el) => {
              const dateFromDB = new Date(el.opendate);
              const imgRef = ref(fstorage, `covers/${el.capsule_id}`);
              try {
                const url = await getDownloadURL(imgRef);
                return {
                  title: el.title,
                  date: dateFromDB.toLocaleDateString(),
                  coverUrl: url,
                };
              } catch (error) {
                console.error("Error fetching image URL:", error);
                return {
                  title: el.title,
                  date: dateFromDB.toLocaleDateString(),
                  coverUrl: "",
                };
              }
            })
          ).then((capsuleObjList) => {
            setCapsulesData(capsuleObjList);
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }, [rerender]);

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "100px",
        }}
      >
        {capsulesData.map((item, index) => (
          <CapsuleListItem
            key={index}
            title={item.title}
            date={item.date}
            coverUrl={item.coverUrl}
          />
        ))}
      </div>
      <div id="plusButton">
        <img
          style={{ width: "100%" }}
          onClick={() => {
            setShowForm(true);
          }}
          src={plusButton}
          alt="plus button"
        />
      </div>

      {showForm && (
        <div
          id="formBG"
          onClick={() => {
            setRerender(!rerender);
            setShowForm(false);
          }}
        ></div>
      )}
      {showForm && (
        <CreateForm
          setShow={setShowForm}
          setRerender={setRerender}
          rerender={rerender}
        />
      )}
      {capsulesData.length === 0 && (<div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bottom: 0,
          zIndex: -10,
          position: "absolute",
        }}
      >
        <p>No capsules yet...</p>
      </div>)}
    </Layout>
  );
};

export default Home;
