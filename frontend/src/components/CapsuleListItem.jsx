import "../stylesheets/global.css";
import "../stylesheets/capsuleListItem.css";

const CapsuleListItem = ({ title = "Title", desc = "Desc", date = "Date" }) => {
  return (
    <div id="mainWrapper">
      <div id="exclamation">!</div>
      <div id="picContainer">
        {/* <div id="picContainer"></div> */}
      </div>
      <div id="titleWrapper">
        <div className="overflowContainer" id="title">{title}</div>
      </div>
      <div id="descWrapper">
        <div className="overflowContainer" id="descr">
          {desc}
        </div>
      </div>
      <div id="date">{date}</div>
    </div>
  );
};

export default CapsuleListItem;
