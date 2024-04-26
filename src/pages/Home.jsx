// App.js

import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import Navigation from "../components/navbar";
import "../App.css";
import Modal from "../components/popup-modal";
import FetchListings from "../components/listeditems";
import CreateListingModal from "../components/creating-listing";
import AuroraHero from "../components/explore-hero";

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
        <AuroraHero />
      </header>{" "}
      <main className="w-full px-8 py-12 items-center gap-8 max-w-6xl mx-auto">
        <Outlet />
        <CreateListingModal />
        <Modal />
        <FetchListings />
      </main>
    </>
  );
}

export default App;
