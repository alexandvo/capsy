import "../stylesheets/global.css";
import "../stylesheets/capsuleListItem.css";

const CapsuleListItem = ({ title = "Title", date = "Date"}) => {
  const currentDate = new Date();
  const selectedDate = new Date(date);
  if (currentDate >= selectedDate) {
    date = "Open now!"
  }
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
