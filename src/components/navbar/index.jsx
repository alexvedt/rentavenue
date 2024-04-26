import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import handleLogout from "../logout";

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVenueManager, setIsVenueManager] = useState(false); // New state for venue manager

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const venueManager = localStorage.getItem("venueManager") === "true"; // Check if 'venueManager' is "true"
    setIsLoggedIn(!!accessToken);
    setIsVenueManager(venueManager); // Set venue manager status
  }, []);

  const profileID = localStorage.getItem("user_name");
  const profileHref = `/profiles/${profileID}`;
  const userCredits = localStorage.getItem("credits");

  const renderNavigationLinks = () => (
    <>
      <li>
        <Link to={"/"} className="hover:bg-background-500 hover:text-white">
          Explore
        </Link>
      </li>
      {isLoggedIn ? (
        <>
          <li>
            <Link
              to={profileHref}
              className="hover:bg-background-500 hover:text-white"
            >
              Profile
            </Link>
          </li>
          {isVenueManager && ( // Only show if isVenueManager is true
            <li>
              <Link
                to={"/manage-venues"}
                className="hover:bg-background-500 hover:text-white"
              >
                Manage Venues
              </Link>
            </li>
          )}
          <li>
            <Link
              to={"/login"}
              onClick={() => handleLogout()}
              className="hover:bg-background-500 hover:text-white"
            >
              Logout
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link
              to={"/register"}
              className="hover:bg-background-500 hover:text-white"
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              to={"/login"}
              className="hover:bg-background-500 hover:text-white"
            >
              Login
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar ">
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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-background-500 rounded-box w-52"
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
            <div className="w-8 rounded-full"></div>
            <p>${userCredits}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
