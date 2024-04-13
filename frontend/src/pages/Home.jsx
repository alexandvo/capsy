import Layout from "../components/Layout";
import "../stylesheets/home.css";
import "../stylesheets/global.css";

import React, { useState } from "react";

import "react-datepicker/dist/react-datepicker.css";

import CapsuleListItem from "../../src/components/CapsuleListItem";
import plusButton from "../assets/imgs/plus-button.png";
import CreateForm from "../components/CreateForm";

const Home = () => {
  const [showForm, setShowForm] = useState(false);

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
        <CapsuleListItem />
        <CapsuleListItem />
        <CapsuleListItem />
        <CapsuleListItem />
        <CapsuleListItem />
        <CapsuleListItem />
        <CapsuleListItem />
        <CapsuleListItem />
        <CapsuleListItem />
        <CapsuleListItem />
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
