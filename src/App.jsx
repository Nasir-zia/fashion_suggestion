import { Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./splash_screen/splashscreen";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./hooks/useAuth";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import ImageUpload from "./components/image";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Splash Screen is always accessible */}
      <Route path="/" element={<SplashScreen />} />

      {/* Auth pages */}
      <Route
        path="/login"
        element={user ? <Navigate to="/image-upload" /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/image-upload" /> : <Signup />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Protected page */}
      <Route
        path="/image-upload"
        element={user ? <ImageUpload /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
