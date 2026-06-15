import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import VideoPlayer from "./pages/VideoPlayer/VideoPlayer";
import Channel from "./pages/Channel/Channel";

function App() {
  return (
    // Provide authentication state to the entire app
    <AuthProvider>
      {/* Enable client-side routing */}
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/video/:id" element={<VideoPlayer />} />

          {/* Protected Route - accessible only to authenticated users  */}
          <Route
            path="/channel/:id"
            element={
              <ProtectedRoute>
                <Channel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
