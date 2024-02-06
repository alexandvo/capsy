import "../stylesheets/header.css";
import icon from "../assets/imgs/time-capsule-icon.png"

const Header = () => {
  return (
    <div className="rect">
      <div id="iconPicContainer">
      <img src={icon}/>

      </div>
      <h1>Capsy</h1>
      <div id="profilePicContainer">
        <div id="pfpCir"></div>
      </div>
    </div>
  );
};

export default Header;

