import "../stylesheets/global.css";
import "../stylesheets/capsuleListItem.css";
import { useState } from "react";

const CapsuleListItem = ({ title = "Title", date = "Date", coverUrl }) => {
  const currentDate = new Date();
  const selectedDate = new Date(date);
  const [isWide, setIsWide] = useState(false);
  if (currentDate >= selectedDate) {
    date = "Open now!";
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
    <div id="mainWrapper">
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
