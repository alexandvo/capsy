import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CapsuleList from "./pages/CapsuleList";
import CapsuleInfo from "./pages/CapsuleInfo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={Signup} />
        <Route path="/" exact Component={Home} />
        <Route path="/capsules" Component={CapsuleList} />
        <Route path="/capsules/:id" Component={CapsuleInfo} />
      </Routes>
    </Router>
  );
}

export default App;
