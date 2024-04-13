import Header from "./Header";
import "../stylesheets/layout.css";
import "../stylesheets/global.css";

const Layout = ({ children }) => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Header />
      <main id="mainArea">{children}</main>
    </div>
  );
};

export default Layout;
