import "../stylesheets/global.css";
import "../stylesheets/capsuleListItem.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CapsuleListItem = ({ id, title = "Title", date = "Date", coverUrl , unlocked}) => {
  const currentDate = new Date();
  const selectedDate = new Date(date);
  const [isWide, setIsWide] = useState(false);

  const navigate = useNavigate();
  if (currentDate >= selectedDate) {
    date = "Open now!";
  }
  if (unlocked) {
    date = "Opened"
  }

  const handleImageLoad = (event) => {
    const img = event.target;
    if (img.naturalWidth > img.naturalHeight) {
      setIsWide(true);
    } else {
      setIsWide(false);
    }
  };
  return (
    <div
      id="mainWrapper"
      onClick={() => {
        navigate(`/${id}`);
      }}
    >
      <div id="picContainer">
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
      <div id="titleWrapper">
        <div className="overflowContainer" id="title">
          {title}
        </div>
      </div>
      <div id="date">{date}</div>
    </div>
  );
};

export default CapsuleListItem;
