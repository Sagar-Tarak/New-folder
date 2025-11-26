import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import TopNav from "./Components/TopNav/TopNav";
import LoginPage from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Merchants from "./Pages/Merchants/Merchants";
import MerchantDetailPage from "./Pages/Merchants/MerchantDetailPage";
import ProtectedRoute from "./Components/ProtectedRoute";

const AppContent = () => {
  const location = useLocation();

  // Support modal routing: when a link sets a `background` in location.state,
  // keep the background location for rendering the page underneath the modal.
  const state = location.state
  const backgroundLocation = state && state.background

  const isLoginPage = location.pathname === "/";

  return (
    <div className="App flex h-screen overflow-hidden">
      {!isLoginPage && (
        <Sidebar />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoginPage && <TopNav />}

        <div
          className={`flex-1 ${
            isLoginPage ? "" : "p-4 sm:p-6 md:p-8"
          } overflow-auto`}
        >
          {/* Render routes; if we have a background location render the background first */}
          <Routes location={backgroundLocation || location}>
            <Route path="/" element={<LoginPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/merchants"
              element={
                <ProtectedRoute>
                  <Merchants />
                </ProtectedRoute>
              }
            />

            <Route
              path="/merchants/:id"
              element={
                <ProtectedRoute>
                  <MerchantDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* If we have a background location, show the modal route on top */}
          {backgroundLocation && (
            <Routes>
              <Route
                path="/merchants/:id"
                element={
                  <ProtectedRoute>
                    <MerchantDetailPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
