import Header from "./Header";
import "../stylesheets/layout.css";
import "../stylesheets/global.css";

const Layout = ({ children }) => {
  return (
    <div style={{width: '100vw', height: '100vh', overflow: "hidden"}}>
      <Header />
      {/* <div style={{width: '100%', height: '12vh'}}/> */}
      {/* <div id="fullscreen">
        <main id="mainArea">
            {children}
        </main>
      </div> */}
      {/* <div style={{height: '80px', opacity: '80%', backgroundColor: 'blue'}}></div> */}
      <main id="mainArea">{children}</main>
    </div>
  );
};

export default Layout;
