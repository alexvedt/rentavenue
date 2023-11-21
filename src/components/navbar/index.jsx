import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import handleLogout from "../logout";

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setIsLoggedIn(!!accessToken);
  }, []);

  const renderNavigationLinks = () => (
    <>
      <li>
        <Link to={"/"}>Explore</Link>
      </li>
      {isLoggedIn ? (
        <>
          <li>
            <Link to={"/profile"}>Profile</Link>
          </li>
          <li>
            <Link to={"/login"} onClick={() => handleLogout()}>
              Logout
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to={"/register"}>Register</Link>
          </li>
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {renderNavigationLinks()}
          </ul>
        </div>
        <Link to={"/"}>
          <a className="btn btn-ghost text-xl">marketZ</a>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{renderNavigationLinks()}</ul>
      </div>
      <div className="navbar-end">
        <Link to={"/profile"}>
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/A-Cat.jpg/800px-A-Cat.jpg"
                alt="User Avatar"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
