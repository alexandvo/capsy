import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CapsuleInfo from "./pages/CapsuleInfo";
import { AuthProvider } from "./contexts/authContext";
import PrivateRoutes from "./components/ProtectedRoutes";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            
            <Route path="capsy/" exact element={<Home />} />
            <Route path="capsy/:id" element={<CapsuleInfo />} />
          </Route>
          <Route path="capsy/forgotpassword" element={<ForgotPassword />} />
          <Route path="capsy/login" element={<Login />} />
          <Route path="capsy/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
