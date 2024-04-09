import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CapsuleList from "./pages/CapsuleList";
import CapsuleInfo from "./pages/CapsuleInfo";
import { AuthProvider } from "./contexts/authContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={Signup} />
          <Route path="/" exact Component={Home} />
          <Route path="/capsules" Component={CapsuleList} />
          <Route path="/capsules/:id" Component={CapsuleInfo} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
