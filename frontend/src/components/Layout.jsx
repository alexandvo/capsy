import Header from "./Header";
import "../stylesheets/layout.css"
import "../stylesheets/global.css"

const Layout = ( {children} ) => {
  return (
    <>
        <Header />
        {/* <div style={{width: '100%', height: '12vh'}}/> */}
        <div id="fullscreen">
        <main id="mainArea">
            {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
