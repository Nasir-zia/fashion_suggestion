// import { useAuth } from "./hooks/useAuth";
// import SplashScreen from "./splash_screen/splashscreen";
// function App() {
//   const { user, loading } = useAuth();

//   if (loading) return <p>Loading...</p>;
//   return <div>{user ? <SplashScreen /> : <p>Not logged in</p>}</div>;
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./splash_screen/splashscreen";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./hooks/useAuth";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <SplashScreen /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Routes>
  );
}

export default App;
