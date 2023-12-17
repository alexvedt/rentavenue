// App.js

import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import Navigation from "../components/navbar";
import "../App.css";
import ShuffleHero from "../components/explore-hero";
import Modal from "../components/popup-modal";
import FetchListings from "../components/listeditems";

function App() {
  const [isLoggedIn, setLoggedIn] = useState();

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
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

      <main className="w-full px-8 py-12 items-center gap-8 max-w-6xl mx-auto">
        <Outlet />
        <ShuffleHero />
        <Modal />
        <FetchListings />
      </main>
    </>
  );
}

export default App;
