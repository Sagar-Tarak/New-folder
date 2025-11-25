import React, { useState } from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    if (status) localStorage.setItem("token", "authenticated");
  };

  const isLoginPage = location.pathname === "/";

  return (
    <div className="App flex h-screen overflow-hidden">
      {!isLoginPage && (
        <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isLoginPage && <TopNav setIsSidebarOpen={setIsSidebarOpen} />}

        <div
          className={`flex-1 ${
            isLoginPage ? "" : "p-4 sm:p-6 md:p-8"
          } overflow-auto`}
        >
          <Routes>
            <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

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
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
