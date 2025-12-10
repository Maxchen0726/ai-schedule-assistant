import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthed(!!token);
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem("access_token", token);
    setIsAuthed(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthed(false);
  };

  return (
    <div className="app-root">
      {isAuthed ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;