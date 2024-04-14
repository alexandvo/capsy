import Layout from "../components/Layout";
import "../stylesheets/home.css";
import "../stylesheets/global.css";

import React, { useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";

import CapsuleListItem from "../../src/components/CapsuleListItem";
import plusButton from "../assets/imgs/plus-button.png";
import CreateForm from "../components/CreateForm";
import { getAuth } from "firebase/auth";

const Home = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [showForm, setShowForm] = useState(false);
  const [capsulesData, setCapsulesData] = useState([]);

  const showIdToken = false;

  async function getCurrentUserIdToken() {
    return await currentUser.getIdToken(true)
  }

  //show current user idtoken
  useEffect(() => {
    if (showIdToken) {
      console.log(getCurrentUserIdToken());
    }
  }, []);

  useEffect(() => {
    getCurrentUserIdToken().then((idToken) => {
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
          const capsuleObjList = data.map((el) => {
            const dateFromDB = new Date(el.opendate);
            return { title: el.title, date: dateFromDB.toLocaleDateString()};
          });
          setCapsulesData(capsuleObjList);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }, []);

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
            setShowForm(false);
          }}
        ></div>
      )}
      {showForm && <CreateForm setShow={setShowForm} />}
    </Layout>
  );
};

export default Home;
