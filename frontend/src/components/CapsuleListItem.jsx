import "../stylesheets/global.css";
import "../stylesheets/capsuleListItem.css";

const CapsuleListItem = ({ title = "Title", desc = "Desc", date = "Date" }) => {
  return (
    <div id="mainWrapper">
      {/* <div style={{paddingLeft: '2vw', backgroundColor: 'red', gridColumn: '2 / 5', gridRow: '1 / 4', borderRadius: '20px'}}></div> */}
      <div id="picContainer">
        {/* <div id="picContainer"></div> */}
      </div>
      <div id="titleWrapper">
        <div className="overflowContainer" id="title">{title}</div>
      </div>
      <div id="date">{date}</div>
    </div>
  );
};

export default CapsuleListItem;
