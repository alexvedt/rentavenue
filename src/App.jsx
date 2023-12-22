import { Outlet } from "@tanstack/react-router";
import "./App.css";

function App() {
  return (
    <>
      <main>
        <Outlet />
      </main>

      <footer className="text-center">
        <small>All rights reserved</small>
      </footer>
    </>
  );
}

export default App;
