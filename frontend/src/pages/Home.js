import Layout from "../components/Layout";
import "../stylesheets/home.css";
import "../stylesheets/global.css";
import plus from "../assets/imgs/plus.png"

const Home = () => {
  return (
    <Layout>
      <div id="mainAreaContainer">
        <div id="box">
          <div id="middleContainer">
            <img src={plus}/>
            <p>New</p>
            <p>Time Capsule</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
