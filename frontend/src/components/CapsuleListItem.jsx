import "../stylesheets/global.css";
import "../stylesheets/capsuleListItem.css";

const CapsuleListItem = ({ title = "Title", desc = "Desc", date = "Date" }) => {
  return (
    <div id="mainWrapper">
      <div id="picContainer">
      </div>
      <div id="titleWrapper">
        <div className="overflowContainer" id="title">{title}</div>
      </div>
      <div id="date">{date}</div>
    </div>
  );
};

export default CapsuleListItem;
