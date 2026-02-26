import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          ClimbBuddy
        </Link>
      </div>
      <button
        className="menu-toggle"
        aria-label="Toggle menu"
        onClick={() => setIsOpen((s) => !s)}
      >
        ☰
      </button>
      <div className="navbar-center">
        <div className="navbar-right">
          <ul
            className="nav-links"
            style={{ display: isOpen ? "flex" : undefined }}
          >
            <li>
              <Link to="/home" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                Log In
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={() => setIsOpen(false)}>
                Create Buddy
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsOpen(false)}>
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="settings-link"
                aria-label="Settings"
              >
                ⚙️
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
