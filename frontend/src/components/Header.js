import "../stylesheets/header.css";
import icon from "../assets/imgs/time-capsule-icon.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="rect">
      <div id="iconPicContainer">
        <Link to="/">
          <img src={icon} />
        </Link>
      </div>

      <h1>Capsy</h1>
      <div id="profilePicContainer">
        <div id="pfpCir"></div>
      </div>
    </div>
  );
};

export default Header;
