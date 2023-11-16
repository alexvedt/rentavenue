import { Link } from "@tanstack/react-router";
import { NAVIGATION } from "../../lib/constants";

const Navigation = () => {
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
            {NAVIGATION.map((item) => (
              <li key={item.href}>
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <Link to={"/"}>
          <a className="btn btn-ghost text-xl">marketZ</a>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {NAVIGATION.map((item) => (
            <li key={item.href}>
              <Link to={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        <Link to={"/profile"}>
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img src="data:image/jpeg;base64,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" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
