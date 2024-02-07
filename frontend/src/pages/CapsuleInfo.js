import "../stylesheets/global.css";
import "../stylesheets/capsuleInfo.css";
import lock from "../assets/imgs/locked.png";
import edit from "../assets/imgs/edit.png";
import del from "../assets/imgs/delete.png";
import TextareaAutosize from "react-textarea-autosize";

const CapsuleInfo = ({ desc="Description", title="Title", unlockable=false }) => {
  return (
    <div id="mainContainer">
      <div id="pfpWrap"></div>
      <div id="buttonWrap">
        <img id="edit" src={edit} alt="edit" />
        <img id="del" src={del} alt="delete" />
      </div>
      <h1>{title}</h1>
      <TextareaAutosize id="desc" value={desc} maxRows={5} />
      <p id="status">{unlockable ? "Unlockable Now!" : "Locked"}</p>
      <img id="lock" src={lock} alt="lock" />
    </div>
  );
};

export default CapsuleInfo;
