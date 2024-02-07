import "../stylesheets/home.css";
import "../stylesheets/capsuleListItem.css";

const CapsuleListItem = ( {title = 'Title', desc = 'Desc', date = 'Date'} ) => {
  return (
    <div id="mainWrapper">
      <div id="exclamation">!</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div id="picContainer"></div>
      </div>
      <div>
        <div className="overflowContainer">{title}</div>
      </div>
      <div>
        <div className="overflowContainer" id="desc">{desc}</div>
      </div>
      <div id="date">{date}</div>
    </div>
  );
};

export default CapsuleListItem;
