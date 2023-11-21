// App.js

import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import Navigation from "../components/navbar";
import "../App.css";

function App() {
  const [isLoggedIn, setLoggedIn] =
    useState(/* Your logic to determine login status */);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // Your logout logic
    setLoggedIn(false);
  };

  return (
    <>
      <header>
        <Navigation
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <small>Created with ❤️ by You</small>
      </footer>
    </>
  );
}

export default App;
