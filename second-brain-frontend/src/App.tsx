import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import SharedBrain from "./pages/SharedBrain";
import SharedContent from "./pages/SharedContent";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        <Route
          path="/signup"
          element={
            <Signup />
          }
        />

        {/* Protected dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>
          }
        />

        {/* Old whole-brain sharing */}

        <Route
          path="/share/:shareId"
          element={
            <SharedBrain />
          }
        />

        {/* NEW individual content sharing */}

        <Route
          path="/share/content/:shareId"
          element={
            <SharedContent />
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;