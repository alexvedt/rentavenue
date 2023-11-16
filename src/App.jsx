import { Outlet } from "@tanstack/react-router";
import "./App.css";

function App() {
  return (
    <>
      <header></header>

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
