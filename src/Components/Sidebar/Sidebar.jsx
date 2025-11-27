import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUIStore from "../../store/useUIStore";
import useAuthStore from "../../store/useAuthStore";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const logout = useAuthStore((s) => s.logout);

  // Note: initial open/closed state is handled by the UI store.
  // Avoid forcing a close on mount here to prevent races with the TopNav hamburger.

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "merchants",
      label: "Merchants",
      path: "/merchants",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <button
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
    fixed md:relative z-50 h-screen
    flex flex-col text-white transition-all duration-300
    ${isSidebarOpen ? "w-64" : "w-0 md:w-20"}
    bg-linear-to-b from-slate-900 to-slate-800 shadow-xl
    overflow-hidden min-w-0
  `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          {isSidebarOpen && (
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Merchants
              </h1>
              <p className="text-xs text-slate-400">Management System</p>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="hidden md:block p-2 rounded-full hover:bg-slate-700/40 transition"
          >
            <svg
              className="w-6 h-6 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto hide-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
          group w-full flex items-center gap-3 px-4 py-3 rounded-lg transition

          ${
            isActive(item.path)
              ? "bg-slate-700 text-white shadow-sm"
              : "text-slate-300 hover:bg-slate-700/40"
          }

          ${isSidebarOpen ? "justify-start" : "justify-center"}
        `}
            >
              <span className="group-hover:text-white">{item.icon}</span>
              {isSidebarOpen && (
                <span className="font-medium group-hover:text-white">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-700">
          {isSidebarOpen && (
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 rounded-lg mb-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-slate-400">admin@example.com</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`
        w-full flex items-center py-3 px-4 rounded-lg 
        bg-linear-to-r from-red-600 to-red-700 text-white font-semibold transition
        hover:from-red-700 hover:to-red-800
        ${isSidebarOpen ? "justify-start" : "justify-center"}
      `}
          >
            <svg
              className={`w-5 h-5 ${isSidebarOpen ? "mr-3" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {isSidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
